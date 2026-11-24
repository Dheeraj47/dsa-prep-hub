import React from 'react';
import type { UnitMeta } from '../types';
import { ProgressBar } from './ProgressBar';
import { useProgress } from '../context/ProgressContext';
import { ArrowRight, BookMarked, Briefcase, CheckCircle2 } from 'lucide-react';

interface UnitCardProps {
  unit: UnitMeta;
  onSelectUnit: (unitId: number) => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({ unit, onSelectUnit }) => {
  const { summary } = useProgress();

  const unitProg = summary.unitProgress[unit.id] || {
    total: 0,
    completed: 0,
    remaining: 0,
    percentage: 0,
  };

  const isCompleted = unitProg.total > 0 && unitProg.completed === unitProg.total;

  const colorVariants: Record<string, { badge: string; progress: string; border: string }> = {
    blue: {
      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      progress: 'from-blue-600 to-indigo-600',
      border: 'hover:border-blue-300 dark:hover:border-blue-800',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      progress: 'from-emerald-600 to-teal-600',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-800',
    },
    amber: {
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      progress: 'from-amber-500 to-orange-600',
      border: 'hover:border-amber-300 dark:hover:border-amber-800',
    },
    indigo: {
      badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
      progress: 'from-indigo-600 to-purple-600',
      border: 'hover:border-indigo-300 dark:hover:border-indigo-800',
    },
    rose: {
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
      progress: 'from-rose-600 to-pink-600',
      border: 'hover:border-rose-300 dark:hover:border-rose-800',
    },
  };

  const scheme = colorVariants[unit.color] || colorVariants.blue;

  return (
    <div
      onClick={() => onSelectUnit(unit.id)}
      className={`group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 transition-all duration-200 hover:shadow-md ${scheme.border} flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${scheme.badge}`}
          >
            UNIT {unit.id}
          </span>

          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Done
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
              {unit.topics.length} Topics
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
          {unit.shortTitle}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {unit.description}
        </p>

        {/* Case Study Tag */}
        {unit.caseStudy && (
          <div className="flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 p-2 rounded-xl mb-4">
            <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate font-medium">{unit.caseStudy.title}</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <ProgressBar
          percentage={unitProg.percentage}
          completed={unitProg.completed}
          total={unitProg.total}
          size="sm"
          color={scheme.progress}
          className="mb-3"
        />

        <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
          <span className="flex items-center gap-1">
            <BookMarked className="w-3.5 h-3.5" /> Study Unit {unit.id}
          </span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
