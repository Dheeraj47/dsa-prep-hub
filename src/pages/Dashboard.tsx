import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { ProgressCard } from '../components/ProgressCard';
import { UnitCard } from '../components/UnitCard';
import type { UnitMeta } from '../types';
import rawSyllabus from '../data/syllabus.json';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DashboardProps {
  onSelectUnit: (unitId: number) => void;
  onOpenAllQuestions: (filter?: string) => void;
  onOpenRevision: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectUnit,
  onOpenAllQuestions,
  onOpenRevision,
}) => {
  const units = rawSyllabus as unknown as UnitMeta[];
  const { summary, questions, completedIds } = useProgress();

  const completedQuestionsList = questions.filter((q) => completedIds.has(q.id));
  const recentCompletions = completedQuestionsList.slice(-4).reverse();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Progress Header */}
      <ProgressCard
        onContinue={() => onSelectUnit(1)}
        onOpenRevision={onOpenRevision}
      />

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div
          onClick={() => onOpenAllQuestions('ALL')}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer shadow-xs min-w-0 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              Total Questions
            </span>
            <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums my-0.5">
            {summary.totalQuestions}
          </span>
          <span className="block text-[10px] sm:text-[11px] text-slate-400 truncate">Full 5-Unit Syllabus</span>
        </div>

        <div
          onClick={() => onOpenAllQuestions('COMPLETED')}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors cursor-pointer shadow-xs min-w-0 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              Mastered / Done
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums my-0.5">
            {summary.completedQuestions}
          </span>
          <span className="block text-[10px] sm:text-[11px] text-slate-400 truncate">
            {summary.percentage}% Syllabus covered
          </span>
        </div>

        <div
          onClick={() => onOpenAllQuestions('INCOMPLETE')}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 transition-colors cursor-pointer shadow-xs min-w-0 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              Pending
            </span>
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums my-0.5">
            {summary.remainingQuestions}
          </span>
          <span className="block text-[10px] sm:text-[11px] text-slate-400 truncate">To 100% target</span>
        </div>

        <div
          onClick={() => onOpenAllQuestions('VERY_IMPORTANT')}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 transition-colors cursor-pointer shadow-xs min-w-0 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              Very Important
            </span>
            <Award className="w-4 h-4 text-rose-500 flex-shrink-0" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums my-0.5">
            {summary.veryImportantCompleted} / {summary.veryImportantTotal}
          </span>
          <span className="block text-[10px] sm:text-[11px] text-slate-400 truncate">High-yield exam keys</span>
        </div>
      </div>

      {/* Five Unit Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Syllabus Units & Topics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any unit to access topic-wise questions, step-by-step algorithms, and numerical dry runs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} onSelectUnit={onSelectUnit} />
          ))}
        </div>
      </div>

      {/* Recently Completed Activity Stream */}
      {recentCompletions.length > 0 && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 sm:mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            Recently Completed Questions
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentCompletions.map((q) => (
              <div
                key={q.id}
                className="py-2.5 sm:py-3 flex items-center justify-between gap-2.5 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 flex-shrink-0 text-[11px] sm:text-xs">
                    {q.displayNumber}
                  </span>
                  <span className="truncate text-slate-700 dark:text-slate-300">
                    {q.title}
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 flex-shrink-0 font-medium">
                  Unit {q.unitId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
