import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  User,
  ShieldCheck,
  CheckCircle2,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { startSession } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to start studying.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Please enter a valid name (at least 2 letters).');
      return;
    }
    setError('');
    setIsSubmitting(true);
    startSession(trimmed);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Top Bar with Brand & Theme Toggle */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DSA PREP HUB
            </span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Study Platform
            </span>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Main Centered Welcome Card */}
      <main className="w-full max-w-md mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-7 sm:p-9 transition-all">
          {/* Subtle Ambient Decorative Gradient Glows */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header & Logo */}
          <div className="relative z-10 text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 mb-4">
              <GraduationCap className="w-7 h-7" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              DSA PREP HUB
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
              University Data Structures & Algorithms exam preparation with verified numericals, step-by-step algorithms, and individual progress tracking.
            </p>
          </div>

          {/* Name Entry Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <div>
              <label
                htmlFor="student-name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2"
              >
                Enter your full name
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="student-name"
                  type="text"
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Alex Sharma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-500 font-semibold mt-1.5 animate-in fade-in duration-150">
                  {error}
                </p>
              )}
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Start Studying</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Micro Caption */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                No account. No password. Start instantly.
              </p>
            </div>
          </form>

          {/* Feature Highlights Pills */}
          <div className="relative z-10 mt-7 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>5 Complete Units</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>67 Exam Questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Isolated Local Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Dry Runs & Complexity</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>DSA PREP HUB – Data Structures & Algorithms Study Platform</p>
      </footer>
    </div>
  );
};
