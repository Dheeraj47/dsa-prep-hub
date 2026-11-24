import React from 'react';
import type { ImportanceLevel, SourceType } from '../types';
import { Award, Star, BookOpen, Briefcase, Landmark, CheckCircle2 } from 'lucide-react';

interface ImportanceBadgeProps {
  importance: ImportanceLevel;
  className?: string;
}

export const ImportanceBadge: React.FC<ImportanceBadgeProps> = ({ importance, className = '' }) => {
  switch (importance) {
    case 'VERY_IMPORTANT':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/80 ${className}`}
          title="High-yield recurring university examination question"
        >
          <Award className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-rose-500 shrink-0" />
          <span>VERY IMPORTANT</span>
        </span>
      );
    case 'IMPORTANT':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/80 ${className}`}
          title="Important core conceptual exam topic"
        >
          <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 shrink-0" />
          <span>IMPORTANT</span>
        </span>
      );
    case 'PRACTICE':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/80 ${className}`}
          title="Practice and conceptual depth problem"
        >
          <BookOpen className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-sky-500 shrink-0" />
          <span>PRACTICE</span>
        </span>
      );
    case 'CASE_STUDY':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/80 ${className}`}
          title="University-mandated real-world case study"
        >
          <Briefcase className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-purple-500 shrink-0" />
          <span>CASE STUDY</span>
        </span>
      );
  }
};

interface SourceBadgeProps {
  source: SourceType;
  label: string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, label, className = '' }) => {
  if (source === 'UNIVERSITY_EXAM') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium max-w-[200px] xs:max-w-[280px] sm:max-w-none bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/80 ${className}`}
        title="Direct question extracted from University Question Bank PDF"
      >
        <Landmark className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium max-w-[200px] xs:max-w-[280px] sm:max-w-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${className}`}
      title="Added to fulfill 100% syllabus topic coverage"
    >
      <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
};
