import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import {
  Bookmark,
  Award,
  Clock,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const RevisionPage: React.FC = () => {
  const { questions, bookmarkedIds, completedIds } = useProgress();
  const [activeTab, setActiveTab] = useState<'BOOKMARKS' | 'INCOMPLETE_VERY_IMP'>('BOOKMARKS');

  const bookmarkedQuestions = questions.filter((q) => bookmarkedIds.has(q.id));
  const incompleteVeryImportant = questions.filter(
    (q) => q.importance === 'VERY_IMPORTANT' && !completedIds.has(q.id)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <RotateCcw className="w-7 h-7 text-amber-500" />
          Revision & Saved Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your bookmarked questions and target high-yield incomplete exam topics before the test.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('BOOKMARKS')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'BOOKMARKS'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Bookmarks ({bookmarkedQuestions.length})
        </button>

        <button
          onClick={() => setActiveTab('INCOMPLETE_VERY_IMP')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'INCOMPLETE_VERY_IMP'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Award className="w-4 h-4 text-rose-500" />
          Incomplete Very Important ({incompleteVeryImportant.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'BOOKMARKS' && (
        <div className="space-y-4">
          {bookmarkedQuestions.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Bookmarked Questions Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                While browsing questions, click the bookmark icon on any question card to save it for quick pre-exam revision.
              </p>
            </div>
          ) : (
            bookmarkedQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} defaultExpanded={true} />
            ))
          )}
        </div>
      )}

      {activeTab === 'INCOMPLETE_VERY_IMP' && (
        <div className="space-y-4">
          {incompleteVeryImportant.length === 0 ? (
            <div className="text-center py-16 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-200 dark:border-emerald-900 p-8">
              <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                Outstanding Achievement! 🎉
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 max-w-sm mx-auto">
                You have completed every single "Very Important" university exam question in the syllabus!
              </p>
            </div>
          ) : (
            incompleteVeryImportant.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))
          )}
        </div>
      )}
    </div>
  );
};
