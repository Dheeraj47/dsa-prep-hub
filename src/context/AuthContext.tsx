import React, { createContext, useContext, useEffect, useState } from 'react';
import type { StudentProfile } from '../types';

interface AuthContextType {
  student: StudentProfile | null;
  profile: StudentProfile | null; // Alias for backward compatibility
  user: null; // Supabase user interface compatibility
  loading: boolean;
  isDemo: boolean;
  startSession: (fullName: string) => void;
  switchStudent: () => void;
  signOut: () => Promise<void>; // Alias for switchStudent
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  loginAsDemoStudent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate unique student ID using crypto.randomUUID() with fallback
function generateStudentId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'student_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
}

const STORAGE_ACTIVE_ID = 'dsa_active_student_id';
const STORAGE_ACTIVE_NAME = 'dsa_active_student_name';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore active student session on mount
  useEffect(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_ACTIVE_ID);
      const savedName = localStorage.getItem(STORAGE_ACTIVE_NAME);

      if (savedId && savedName) {
        setStudent({
          id: savedId,
          fullName: savedName,
          isDemo: false,
        });
      }
    } catch (e) {
      console.warn('Could not read saved student session from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Start new guest student session
  const startSession = (fullName: string) => {
    const trimmed = fullName.trim();
    if (!trimmed) return;

    // Generate unique random student ID
    const studentId = generateStudentId();

    try {
      localStorage.setItem(STORAGE_ACTIVE_ID, studentId);
      localStorage.setItem(STORAGE_ACTIVE_NAME, trimmed);
      // Also cache name specifically under student ID for persistence
      localStorage.setItem(`dsa_student_name_${studentId}`, trimmed);
    } catch (e) {
      console.warn('Failed to store student session in localStorage:', e);
    }

    setStudent({
      id: studentId,
      fullName: trimmed,
      isDemo: false,
    });
  };

  // Switch/Change student (returns to Welcome Screen)
  const switchStudent = () => {
    try {
      localStorage.removeItem(STORAGE_ACTIVE_ID);
      localStorage.removeItem(STORAGE_ACTIVE_NAME);
    } catch (e) {
      console.warn('Failed to clear active student from localStorage:', e);
    }
    setStudent(null);
  };

  const signOut = async () => {
    switchStudent();
  };

  // Supabase compatibility stubs
  const signIn = async () => ({ error: null });
  const signUp = async () => ({ error: null });
  const resetPassword = async () => ({ error: null });
  const loginAsDemoStudent = () => {
    startSession('Demo Student');
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        profile: student,
        user: null,
        loading,
        isDemo: false,
        startSession,
        switchStudent,
        signOut,
        signIn,
        signUp,
        resetPassword,
        loginAsDemoStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
