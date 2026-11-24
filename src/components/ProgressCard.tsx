import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from './ProgressBar';
import {
  Trophy,
  Award,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface ProgressCardProps {
  onContinue: () => void;
  onOpenRevision: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  onContinue,
  onOpenRevision,
}) => {
  const { profile } = useAuth();
  const { summary, questions, lastVisitedId } = useProgress();

  const lastQuestion = lastVisitedId
    ? questions.find((q) => q.id === lastVisitedId)
    : questions[0];

  const studentName = profile?.fullName || 'Student';

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 lg:p-8 shadow-xl border border-slate-800">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8">
        {/* Left side: Greeting and Completion Overview */}
        <div className="space-y-3 sm:space-y-4 max-w-xl min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="truncate">University Exam Preparation Hub</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight break-words">
              Welcome, {studentName}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Track your individual syllabus coverage, master university numericals, and prepare for exams with confidence.
            </p>
          </div>

          {/* Quick Continue Card */}
          {lastQuestion && (
            <div className="flex items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Continue Where You Left Off
                </span>
                <p className="text-xs sm:text-sm font-semibold truncate text-slate-100">
                  {lastQuestion.displayNumber}: {lastQuestion.title}
                </p>
              </div>
              <button
                onClick={onContinue}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white transition-all shadow-xs flex-shrink-0 min-h-[38px]"
                aria-label="Resume question"
              >
                <span>Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right side: Circular / Progress Stats Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 border border-white/10 lg:w-80 w-full flex flex-col justify-between space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
              Syllabus Completion
            </span>
            <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {summary.percentage}%
            </span>
          </div>

          <ProgressBar
            percentage={summary.percentage}
            completed={summary.completedQuestions}
            total={summary.totalQuestions}
            size="md"
            showLabel={false}
            color="from-blue-400 via-indigo-400 to-emerald-400"
          />

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center pt-2 border-t border-white/10">
            <div className="p-1.5 sm:p-2 rounded-xl bg-white/5 min-w-0">
              <span className="block text-base sm:text-lg font-black text-emerald-400 tabular-nums truncate">
                {summary.completedQuestions}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium block truncate">Done</span>
            </div>

            <div className="p-1.5 sm:p-2 rounded-xl bg-white/5 min-w-0">
              <span className="block text-base sm:text-lg font-black text-amber-400 tabular-nums truncate">
                {summary.remainingQuestions}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium block truncate">Pending</span>
            </div>

            <div className="p-1.5 sm:p-2 rounded-xl bg-white/5 min-w-0">
              <span className="block text-base sm:text-lg font-black text-rose-400 tabular-nums truncate">
                {summary.veryImportantCompleted}/{summary.veryImportantTotal}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium block truncate">Very Imp</span>
            </div>
          </div>

          <button
            onClick={onOpenRevision}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center bg-white/10 hover:bg-white/20 active:scale-[0.99] text-white transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Revision Mode (Incomplete)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
