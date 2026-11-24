import React, { useState } from 'react';
import type { Question } from '../types';
import { ImportanceBadge, SourceBadge } from './ImportanceBadge';
import { useProgress } from '../context/ProgressContext';
import {
  CheckCircle,
  Circle,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  HardDrive,
  Lightbulb,
  Copy,
  Check,
  Code,
  Table as TableIcon,
  Layers,
  BookOpen,
  Cpu,
  Workflow,
  Sparkles,
  CheckCircle2,
  XCircle,
  Compass,
  Columns,
  Calculator,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  defaultExpanded?: boolean;
}

// Helper to format text paragraphs with readable line height and spacing
const FormattedParagraphs: React.FC<{ content: string; className?: string }> = ({
  content,
  className = 'text-xs sm:text-sm md:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed space-y-2.5 sm:space-y-3 break-words',
}) => {
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  return (
    <div className={className}>
      {paragraphs.map((p, idx) => (
        <p key={idx} className="whitespace-pre-line">
          {p.trim()}
        </p>
      ))}
    </div>
  );
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDiagram, setCopiedDiagram] = useState(false);

  const { completedIds, bookmarkedIds, toggleDone, toggleBookmark } = useProgress();

  const isDone = completedIds.has(question.id);
  const isBookmarked = bookmarkedIds.has(question.id);

  const handleCopy = (text: string, type: 'code' | 'diagram') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedDiagram(true);
      setTimeout(() => setCopiedDiagram(false), 2000);
    }
  };

  const { answer } = question;

  return (
    <div
      id={question.id}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isDone
          ? 'bg-emerald-50/15 dark:bg-emerald-950/10 border-emerald-200/80 dark:border-emerald-900/50'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Question Header Bar */}
      <div className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0 w-full">
          {/* Mark as Done Toggle Button */}
          <button
            onClick={() => toggleDone(question.id)}
            type="button"
            className={`mt-0.5 sm:mt-0 min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0 p-1 rounded-xl transition-all duration-200 cursor-pointer ${
              isDone
                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isDone ? 'Mark as Incomplete' : 'Mark as Done'}
            aria-label={isDone ? 'Mark as Incomplete' : 'Mark as Done'}
          >
            {isDone ? (
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-emerald-100 dark:fill-emerald-950" />
            ) : (
              <Circle className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

          {/* Number, Badges, and Title */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-bold font-mono bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 shadow-xs shrink-0">
                {question.displayNumber}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs whitespace-nowrap">
                6–7 Marks Model Answer
              </span>
              <ImportanceBadge importance={question.importance} />
              <SourceBadge source={question.source} label={question.sourceLabel} />
            </div>

            <h3
              onClick={() => setExpanded(!expanded)}
              className={`text-sm sm:text-base md:text-lg font-bold cursor-pointer leading-snug transition-colors break-words ${
                isDone
                  ? 'text-slate-600 dark:text-slate-400 line-through decoration-emerald-500/50'
                  : 'text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {question.title}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
          <button
            onClick={() => toggleBookmark(question.id)}
            type="button"
            className={`min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Save for Revision'}
            aria-label={isBookmarked ? 'Remove Bookmark' : 'Save for Revision'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            type="button"
            className="flex-1 sm:flex-none justify-center min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {expanded ? (
              <>
                Hide Answer <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                View Answer <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Answer Content - University Examination Textbook Layout */}
      {expanded && (
        <div className="px-3.5 sm:px-7 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-6 sm:space-y-7 animate-in fade-in duration-200 text-slate-800 dark:text-slate-200 overflow-hidden">
          {/* SECTION A: Introduction */}
          {answer.introduction && (
            <section className="space-y-2">
              <h4 className="text-xs font-bold tracking-wider uppercase text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>1. Introduction</span>
              </h4>
              <FormattedParagraphs content={answer.introduction} />
            </section>
          )}

          {/* SECTION B: Formal Definition */}
          {answer.definition && (
            <section className="space-y-2">
              <h4 className="text-xs font-bold tracking-wider uppercase text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>2. Technical Definition</span>
              </h4>
              <div className="border-l-4 border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 sm:p-5 rounded-r-2xl shadow-xs">
                <p className="text-xs sm:text-sm md:text-[15px] font-medium text-slate-900 dark:text-blue-100 leading-relaxed whitespace-pre-line break-words">
                  {answer.definition}
                </p>
              </div>
            </section>
          )}

          {/* SECTION C: Detailed Explanation */}
          {(answer.detailedExplanation || answer.explanation) && (
            <section className="space-y-2.5">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                <span>3. Detailed Conceptual Explanation</span>
              </h4>
              <FormattedParagraphs
                content={answer.detailedExplanation || answer.explanation || ''}
              />
            </section>
          )}

          {/* SECTION D: Labelled Diagram */}
          {answer.diagram && (
            <section className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>4. Architectural Diagram & Structural Representation</span>
                </h4>
                <button
                  onClick={() => handleCopy(answer.diagram!, 'diagram')}
                  className="min-h-[32px] px-2 py-1 flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {copiedDiagram ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDiagram ? 'Copied' : 'Copy Diagram'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 p-3 sm:p-5 border border-slate-800 shadow-inner overflow-x-auto code-scrollbar max-w-full touch-pan-x">
                <pre className="font-mono text-[11px] xs:text-xs sm:text-[13px] text-emerald-400 dark:text-emerald-300 leading-relaxed whitespace-pre">
                  {answer.diagram.trim()}
                </pre>
              </div>

              {answer.diagramExplanation && (
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic pt-1 pl-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 not-italic">
                    Diagram Explanation:{' '}
                  </span>
                  {answer.diagramExplanation}
                </div>
              )}
            </section>
          )}

          {/* SECTION E: Step-by-Step Working / Operations */}
          {(answer.working || answer.operations) && (
            <section className="space-y-2.5">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>5. Operations & Step-by-Step Procedure</span>
              </h4>
              <FormattedParagraphs content={answer.working || answer.operations || ''} />
            </section>
          )}

          {/* SECTION F: Algorithm / Pseudocode */}
          {answer.algorithm && (
            <section className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>6. Algorithm & Pseudocode</span>
                </h4>
                <button
                  onClick={() => handleCopy(answer.algorithm!, 'code')}
                  className="min-h-[32px] px-2 py-1 flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Pseudocode'}</span>
                </button>
              </div>

              <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 p-3 sm:p-5 border border-slate-800 shadow-inner overflow-x-auto code-scrollbar max-w-full touch-pan-x">
                <pre className="font-mono text-[11px] xs:text-xs sm:text-[13px] text-blue-100 dark:text-blue-200 leading-relaxed whitespace-pre">
                  {answer.algorithm.trim()}
                </pre>
              </div>

              {answer.algorithmExplanation && (
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1 pl-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Algorithm Walkthrough:{' '}
                  </span>
                  {answer.algorithmExplanation}
                </div>
              )}
            </section>
          )}

          {/* SECTION G: Concrete Worked Example */}
          {answer.example && (
            <section className="space-y-2.5">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-500 shrink-0" />
                <span>7. Concrete Example & Intermediate Calculations</span>
              </h4>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <FormattedParagraphs content={answer.example} />
              </div>
            </section>
          )}

          {/* SECTION H: Trace Table / Step-by-Step Dry Run */}
          {answer.dryRun && typeof answer.dryRun === 'object' && (
            <section className="space-y-2.5">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>8. {answer.dryRun.title || 'Step-by-Step Execution Dry Run'}</span>
              </h4>
              <div className="overflow-x-auto code-scrollbar rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-full touch-pan-x">
                <table className="w-full text-left text-[11px] sm:text-xs md:text-[13px] min-w-[320px]">
                  <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider">
                    <tr>
                      {answer.dryRun.headers.map((h, i) => (
                        <th key={i} className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-mono">
                    {answer.dryRun.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={rIdx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/60 dark:bg-slate-800/25'}
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 sm:px-4 py-2 sm:py-2.5 text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SECTION I: University Comparison Table */}
          {answer.comparisonTable && (
            <section className="space-y-2.5">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Columns className="w-4 h-4 text-purple-500 shrink-0" />
                <span>{answer.comparisonTable.title || 'Comparative Technical Matrix'}</span>
              </h4>
              <div className="overflow-x-auto code-scrollbar rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-full touch-pan-x">
                <table className="w-full text-left text-[11px] sm:text-xs md:text-[13px] min-w-[340px]">
                  <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider">
                    <tr>
                      {answer.comparisonTable.headers.map((h, i) => (
                        <th key={i} className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {answer.comparisonTable.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={rIdx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/60 dark:bg-slate-800/25'}
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-3 sm:px-4 py-2 sm:py-2.5 break-words ${
                              cIdx === 0
                                ? 'font-bold text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-800/40'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SECTION J: Time and Space Complexity Analysis */}
          {(answer.timeComplexity || answer.spaceComplexity) && (
            <section className="space-y-3 pt-1">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>9. Time & Space Complexity Analysis</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {answer.timeComplexity && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                    <div className="flex items-center gap-2 mb-1.5 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>Time Complexity</span>
                    </div>
                    <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white mb-1 break-words">
                      {typeof answer.timeComplexity === 'string'
                        ? answer.timeComplexity
                        : answer.timeComplexity.summary ||
                          `Best: ${answer.timeComplexity.best || '-'} | Avg: ${answer.timeComplexity.average || '-'} | Worst: ${answer.timeComplexity.worst || '-'}`}
                    </p>
                    {typeof answer.timeComplexity === 'object' && answer.timeComplexity.explanation && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1 break-words">
                        {answer.timeComplexity.explanation}
                      </p>
                    )}
                  </div>
                )}

                {answer.spaceComplexity && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
                    <div className="flex items-center gap-2 mb-1.5 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider">
                      <HardDrive className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>Space Complexity</span>
                    </div>
                    <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white break-words">
                      {answer.spaceComplexity}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION K: Advantages, Disadvantages & Real-World Applications */}
          {((answer.advantages && answer.advantages.length > 0) ||
            (answer.disadvantages && answer.disadvantages.length > 0) ||
            (answer.applications && answer.applications.length > 0)) && (
            <section className="space-y-3 pt-1">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>10. Technical Evaluation: Advantages, Disadvantages & Applications</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Advantages */}
                {answer.advantages && answer.advantages.length > 0 && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Key Advantages</span>
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
                      {answer.advantages.map((adv, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span className="break-words">{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disadvantages */}
                {answer.disadvantages && answer.disadvantages.length > 0 && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>Limitations & Disadvantages</span>
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
                      {answer.disadvantages.map((dis, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <span className="break-words">{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Applications */}
                {answer.applications && answer.applications.length > 0 && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/40 space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Real-World Applications</span>
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
                      {answer.applications.map((app, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span className="break-words">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION L: Meaningful Academic Conclusion */}
          {answer.conclusion && (
            <section className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>11. Summary & Concluding Remarks</span>
              </h4>
              <FormattedParagraphs content={answer.conclusion} />
            </section>
          )}

          {/* University Exam Tip Pill */}
          {answer.examTip && (
            <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-900/40 shadow-xs">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="block text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-0.5">
                  University Exam Scoring Tip
                </span>
                <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed font-medium break-words">
                  {answer.examTip}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] sm:text-xs text-slate-400 font-mono text-center sm:text-left truncate">
              Unit {question.unitId} • {question.topicTitle}
            </span>
            <button
              onClick={() => toggleDone(question.id)}
              className={`w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isDone
                  ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]'
              }`}
            >
              {isDone ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Marked as Done
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" /> Mark as Done
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
