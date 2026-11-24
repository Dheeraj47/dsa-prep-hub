import React, { useState } from 'react';
import type { TopicMeta, Question } from '../types';
import { QuestionCard } from './QuestionCard';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface TopicAccordionProps {
  topic: TopicMeta;
  questions: Question[];
  defaultOpen?: boolean;
}

export const TopicAccordion: React.FC<TopicAccordionProps> = ({
  topic,
  questions,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { summary } = useProgress();

  const topicProg = summary.topicProgress[topic.id] || {
    total: questions.length,
    completed: 0,
    remaining: questions.length,
    percentage: 0,
  };

  const isAllDone = topicProg.total > 0 && topicProg.completed === topicProg.total;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="w-full p-3.5 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <div className="flex-1 min-w-0 pr-2 sm:pr-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2 break-words">
              <span>{topic.title}</span>
              {isAllDone && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0" />
              )}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
            {topic.description}
          </p>

          {/* Mini progress indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-16 xs:w-24 sm:w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${topicProg.percentage}%` }}
              />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap">
              {topicProg.completed}/{topicProg.total} ({topicProg.percentage}%)
            </span>
          </div>
        </div>

        <div className="min-w-[36px] min-h-[36px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-2.5 xs:p-3.5 sm:p-5 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/40">
          {questions.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 italic">No questions currently in this topic.</p>
          ) : (
            questions.map((q) => <QuestionCard key={q.id} question={q} />)
          )}
        </div>
      )}
    </div>
  );
};
