import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { Question, ProgressSummary } from '../types';
import rawQuestions from '../data/questions.json';
import { calculateProgress } from '../lib/progressUtils';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { fireMilestoneConfetti } from '../lib/confetti';

interface ProgressContextType {
  questions: Question[];
  completedIds: Set<string>;
  bookmarkedIds: Set<string>;
  lastVisitedId: string | null;
  summary: ProgressSummary;
  isSaving: boolean;
  toggleDone: (questionId: string) => Promise<void>;
  toggleBookmark: (questionId: string) => Promise<void>;
  setLastVisited: (questionId: string) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const questions = useMemo(() => rawQuestions as unknown as Question[], []);

  const studentId = profile?.id;

  // Question completion set isolated per student ID
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    if (!studentId) return new Set();
    try {
      const saved = localStorage.getItem(`dsa_progress_${studentId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Bookmarks set isolated per student ID
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    if (!studentId) return new Set();
    try {
      const saved = localStorage.getItem(`dsa_bookmarks_${studentId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Last visited question ID isolated per student ID
  const [lastVisitedId, setLastVisitedId] = useState<string | null>(() => {
    if (!studentId) return null;
    return localStorage.getItem(`dsa_last_visited_${studentId}`) || null;
  });

  const [isSaving, setIsSaving] = useState(false);

  // When active student changes, reload their isolated progress from localStorage
  useEffect(() => {
    if (!studentId) {
      setCompletedIds(new Set());
      setBookmarkedIds(new Set());
      setLastVisitedId(null);
      return;
    }

    try {
      const progressKey = `dsa_progress_${studentId}`;
      const savedProgress = localStorage.getItem(progressKey);
      setCompletedIds(savedProgress ? new Set(JSON.parse(savedProgress)) : new Set());

      const bookmarksKey = `dsa_bookmarks_${studentId}`;
      const savedBookmarks = localStorage.getItem(bookmarksKey);
      setBookmarkedIds(savedBookmarks ? new Set(JSON.parse(savedBookmarks)) : new Set());

      const lastVisitedKey = `dsa_last_visited_${studentId}`;
      setLastVisitedId(localStorage.getItem(lastVisitedKey) || null);
    } catch (e) {
      console.warn('Failed to load student progress from storage:', e);
      setCompletedIds(new Set());
      setBookmarkedIds(new Set());
    }

    // Optional Supabase cloud synchronization if configured
    if (supabase) {
      const client = supabase;
      const syncRemote = async () => {
        try {
          const { data: sessionData } = await client.auth.getSession();
          const sessionUser = sessionData?.session?.user;
          if (sessionUser) {
            const { data } = await client
              .from('question_progress')
              .select('question_id, is_done')
              .eq('user_id', sessionUser.id);

            if (data && data.length > 0) {
              const remote = new Set<string>();
              for (const item of data) {
                if (item.is_done) remote.add(item.question_id);
              }
              setCompletedIds(remote);
              localStorage.setItem(`dsa_progress_${studentId}`, JSON.stringify(Array.from(remote)));
            }
          }
        } catch {
          // Gracefully fallback to local storage
        }
      };
      syncRemote();
    }
  }, [studentId]);

  // Live calculated summary (overall, unit-wise, topic-wise)
  const summary = useMemo(() => {
    return calculateProgress(questions, completedIds);
  }, [questions, completedIds]);

  // Toggle question done / not done with optimistic update and isolated persistence
  const toggleDone = async (questionId: string) => {
    if (!studentId) return;

    const isCurrentlyDone = completedIds.has(questionId);
    const nextState = !isCurrentlyDone;

    // Optimistic UI update
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (nextState) {
        next.add(questionId);
      } else {
        next.delete(questionId);
      }
      try {
        localStorage.setItem(`dsa_progress_${studentId}`, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      return next;
    });

    setLastVisitedId(questionId);
    try {
      localStorage.setItem(`dsa_last_visited_${studentId}`, questionId);
    } catch {}

    // Check if unit milestone reached 100%
    if (nextState) {
      const q = questions.find(item => item.id === questionId);
      if (q) {
        const uId = q.unitId;
        const uProg = summary.unitProgress[uId];
        if (uProg && uProg.completed + 1 === uProg.total) {
          fireMilestoneConfetti();
        }
      }
    }

    // Optional remote persistence if Supabase session is active
    if (supabase) {
      setIsSaving(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from('question_progress').upsert({
            user_id: session.user.id,
            question_id: questionId,
            is_done: nextState,
            completed_at: nextState ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id, question_id' });
        }
      } catch (err) {
        console.warn('Remote sync skipped (local-first storage active):', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Toggle bookmark with optimistic update and isolated persistence
  const toggleBookmark = async (questionId: string) => {
    if (!studentId) return;

    const isBookmarked = bookmarkedIds.has(questionId);
    const nextState = !isBookmarked;

    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (nextState) next.add(questionId);
      else next.delete(questionId);
      try {
        localStorage.setItem(`dsa_bookmarks_${studentId}`, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn('LocalStorage bookmark save failed:', e);
      }
      return next;
    });

    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (nextState) {
            await supabase.from('user_bookmarks').upsert({
              user_id: session.user.id,
              question_id: questionId,
            }, { onConflict: 'user_id, question_id' });
          } else {
            await supabase
              .from('user_bookmarks')
              .delete()
              .match({ user_id: session.user.id, question_id: questionId });
          }
        }
      } catch (err) {
        console.warn('Remote bookmark sync skipped:', err);
      }
    }
  };

  const setLastVisited = (questionId: string) => {
    if (!studentId) return;
    setLastVisitedId(questionId);
    try {
      localStorage.setItem(`dsa_last_visited_${studentId}`, questionId);
    } catch {}
  };

  const resetProgress = () => {
    if (!studentId) return;
    if (confirm('Are you sure you want to reset your question progress to zero?')) {
      setCompletedIds(new Set());
      setBookmarkedIds(new Set());
      try {
        localStorage.removeItem(`dsa_progress_${studentId}`);
        localStorage.removeItem(`dsa_bookmarks_${studentId}`);
        localStorage.removeItem(`dsa_last_visited_${studentId}`);
      } catch {}
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        questions,
        completedIds,
        bookmarkedIds,
        lastVisitedId,
        summary,
        isSaving,
        toggleDone,
        toggleBookmark,
        setLastVisited,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
