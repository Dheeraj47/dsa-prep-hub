import React, { useState, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import { SearchBar } from '../components/SearchBar';
import type { ImportanceLevel } from '../types';
import {
  Filter,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

type FilterCategory =
  | 'ALL'
  | 'COMPLETED'
  | 'INCOMPLETE'
  | 'VERY_IMPORTANT'
  | 'IMPORTANT'
  | 'PRACTICE'
  | 'CASE_STUDY'
  | 'UNIVERSITY_EXAM'
  | 'ADDED';

type SortOption = 'DEFAULT' | 'IMPORTANCE' | 'UNIT';

export const AllQuestionsPage: React.FC = () => {
  const { questions, completedIds } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('DEFAULT');
  const [unitFilter, setUnitFilter] = useState<number | 'ALL'>('ALL');

  const filteredAndSortedQuestions = useMemo(() => {
    let result = [...questions];

    // 1. Text Search across Title, Topic, Algorithm, and Question Number
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const fullString = `${item.displayNumber} ${item.title} ${item.topicTitle} ${
          item.unitTitle
        } ${item.sourceLabel} ${item.answer.definition} ${item.answer.algorithm || ''} ${
          item.answer.example || ''
        }`.toLowerCase();
        return fullString.includes(q);
      });
    }

    // 2. Unit Filter
    if (unitFilter !== 'ALL') {
      result = result.filter((item) => item.unitId === unitFilter);
    }

    // 3. Category Filter
    switch (activeFilter) {
      case 'COMPLETED':
        result = result.filter((item) => completedIds.has(item.id));
        break;
      case 'INCOMPLETE':
        result = result.filter((item) => !completedIds.has(item.id));
        break;
      case 'VERY_IMPORTANT':
        result = result.filter((item) => item.importance === 'VERY_IMPORTANT');
        break;
      case 'IMPORTANT':
        result = result.filter((item) => item.importance === 'IMPORTANT');
        break;
      case 'PRACTICE':
        result = result.filter((item) => item.importance === 'PRACTICE');
        break;
      case 'CASE_STUDY':
        result = result.filter((item) => item.importance === 'CASE_STUDY');
        break;
      case 'UNIVERSITY_EXAM':
        result = result.filter((item) => item.source === 'UNIVERSITY_EXAM');
        break;
      case 'ADDED':
        result = result.filter((item) => item.source === 'ADDED_SYLLABUS_COMPLETION');
        break;
      case 'ALL':
      default:
        break;
    }

    // 4. Sorting
    if (sortOption === 'IMPORTANCE') {
      const rank: Record<ImportanceLevel, number> = {
        VERY_IMPORTANT: 1,
        CASE_STUDY: 2,
        IMPORTANT: 3,
        PRACTICE: 4,
      };
      result.sort((a, b) => rank[a.importance] - rank[b.importance]);
    } else if (sortOption === 'UNIT') {
      result.sort((a, b) => a.unitId - b.unitId);
    }

    return result;
  }, [questions, completedIds, searchQuery, activeFilter, sortOption, unitFilter]);

  const filterTabs: { id: FilterCategory; label: string; count?: number }[] = [
    { id: 'ALL', label: 'All Questions', count: questions.length },
    { id: 'INCOMPLETE', label: 'Pending', count: questions.filter((q) => !completedIds.has(q.id)).length },
    { id: 'COMPLETED', label: 'Completed', count: completedIds.size },
    { id: 'VERY_IMPORTANT', label: 'Very Important', count: questions.filter((q) => q.importance === 'VERY_IMPORTANT').length },
    { id: 'IMPORTANT', label: 'Important', count: questions.filter((q) => q.importance === 'IMPORTANT').length },
    { id: 'PRACTICE', label: 'Practice', count: questions.filter((q) => q.importance === 'PRACTICE').length },
    { id: 'CASE_STUDY', label: 'Case Studies', count: questions.filter((q) => q.importance === 'CASE_STUDY').length },
    { id: 'UNIVERSITY_EXAM', label: 'University Paper (Original)', count: questions.filter((q) => q.source === 'UNIVERSITY_EXAM').length },
    { id: 'ADDED', label: 'Added (Syllabus Completion)', count: questions.filter((q) => q.source === 'ADDED_SYLLABUS_COMPLETION').length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Complete Question Bank</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, and filter all 67 university questions, case studies, and syllabus additions.
          </p>
        </div>

        <span className="self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
          Showing {filteredAndSortedQuestions.length} of {questions.length} Questions
        </span>
      </div>

      {/* Search and Filters Control Center */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, algorithm, topic, question number (e.g., Q10, AVL, Quick Sort)..."
        />

        {/* Filter Pills Scrollable Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs scrollbar-none touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary controls: Unit filter and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Unit selection */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-semibold mr-1 shrink-0">Unit:</span>
            {(['ALL', 1, 2, 3, 4, 5] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnitFilter(u)}
                className={`min-h-[32px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  unitFilter === u
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {u === 'ALL' ? 'All Units' : `Unit ${u}`}
              </button>
            ))}
          </div>

          {/* Sort order */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <span className="text-slate-500 font-semibold shrink-0">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none min-h-[34px] flex-1 sm:flex-none cursor-pointer"
            >
              <option value="DEFAULT">Question Number</option>
              <option value="IMPORTANCE">Importance Tier (High to Low)</option>
              <option value="UNIT">Unit (1 to 5)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Stack */}
      {filteredAndSortedQuestions.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No questions match your current search or filters.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing filters, or switching units.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('ALL');
              setUnitFilter('ALL');
            }}
            className="mt-4 min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
};
