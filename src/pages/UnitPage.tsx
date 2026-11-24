import React, { useState } from 'react';
import type { UnitMeta, Question } from '../types';
import { TopicAccordion } from '../components/TopicAccordion';
import { ProgressBar } from '../components/ProgressBar';
import { SearchBar } from '../components/SearchBar';
import { useProgress } from '../context/ProgressContext';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface UnitPageProps {
  unit: UnitMeta;
  onBack: () => void;
}

export const UnitPage: React.FC<UnitPageProps> = ({ unit, onBack }) => {
  const { questions, summary } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOMPLETE' | 'COMPLETED' | 'VERY_IMPORTANT'>('ALL');

  const unitProg = summary.unitProgress[unit.id] || {
    total: 0,
    completed: 0,
    remaining: 0,
    percentage: 0,
  };

  // Filter questions for this unit
  const unitQuestions = questions.filter((q) => q.unitId === unit.id);

  // Apply search and filter
  const filteredQuestions = unitQuestions.filter((q) => {
    // Search matching
    if (searchQuery.trim()) {
      const qText = `${q.displayNumber} ${q.title} ${q.topicTitle} ${q.answer.definition}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }

    if (filterType === 'INCOMPLETE') {
      return !summary.topicProgress[q.topicId]; // Or check completed
    }
    if (filterType === 'VERY_IMPORTANT') {
      return q.importance === 'VERY_IMPORTANT';
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation Breadcrumb */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Unit Banner Header */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              UNIT {unit.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {unit.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {unit.description}
            </p>
          </div>

          {/* Unit Progress Gauge */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 md:w-64 flex flex-col justify-between space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300 uppercase">Unit Progress</span>
              <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                {unitProg.percentage}%
              </span>
            </div>
            <ProgressBar
              percentage={unitProg.percentage}
              completed={unitProg.completed}
              total={unitProg.total}
              size="md"
              showLabel={false}
              color="from-blue-600 to-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>{unitProg.completed} done</span>
              <span>{unitProg.remaining} remaining</span>
            </div>
          </div>
        </div>

        {/* Case Study Callout Banner */}
        {unit.caseStudy && (
          <div className="mt-6 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                  Official Syllabus Case Study: {unit.caseStudy.title}
                </span>
                <p className="text-xs text-purple-950 dark:text-purple-200 leading-relaxed">
                  {unit.caseStudy.scenario}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter questions in this unit..."
          className="flex-1 max-w-md"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'INCOMPLETE', 'VERY_IMPORTANT'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {type === 'ALL' && 'All Questions'}
              {type === 'INCOMPLETE' && 'Incomplete'}
              {type === 'VERY_IMPORTANT' && 'Very Important'}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Accordion Stack */}
      <div className="space-y-4">
        {unit.topics.map((topic) => {
          const topicQuestions = filteredQuestions.filter(
            (q) => q.topicId === topic.id
          );
          return (
            <TopicAccordion
              key={topic.id}
              topic={topic}
              questions={topicQuestions}
              defaultOpen={true}
            />
          );
        })}
      </div>
    </div>
  );
};
