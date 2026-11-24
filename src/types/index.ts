export type ImportanceLevel = 'VERY_IMPORTANT' | 'IMPORTANT' | 'PRACTICE' | 'CASE_STUDY';

export type SourceType = 'UNIVERSITY_EXAM' | 'ADDED_SYLLABUS_COMPLETION';

export interface DryRunTable {
  title?: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface ComparisonTable {
  title?: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface AnswerSection {
  introduction?: string;
  definition?: string;
  detailedExplanation?: string;
  diagram?: string;
  diagramExplanation?: string;
  working?: string;
  operations?: string;
  algorithm?: string;
  algorithmExplanation?: string;
  example?: string;
  dryRun?: DryRunTable | string;
  comparisonTable?: ComparisonTable;
  timeComplexity?: {
    best?: string;
    average?: string;
    worst?: string;
    summary?: string;
    explanation?: string;
  } | string;
  spaceComplexity?: string;
  advantages?: string[];
  disadvantages?: string[];
  applications?: string[];
  conclusion?: string;
  examTip?: string;
  // Fallbacks for transitional compatibility
  explanation?: string;
  importantPoints?: string[];
}

export interface Question {
  id: string;
  originalNumber?: number;
  displayNumber: string;
  title: string;
  unitId: number;
  unitTitle: string;
  topicId: string;
  topicTitle: string;
  importance: ImportanceLevel;
  source: SourceType;
  sourceLabel: string;
  answer: AnswerSection;
}

export interface TopicMeta {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface CaseStudyMeta {
  title: string;
  scenario: string;
  learningOutcome: string;
}

export interface UnitMeta {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  accent: string;
  caseStudy: CaseStudyMeta;
  topics: TopicMeta[];
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email?: string;
  college?: string;
  department?: string;
  semester?: string;
  isDemo?: boolean;
}

export interface UserProgressState {
  completedQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  lastVisitedQuestionId: string | null;
  lastActiveTimestamp: string;
}

export interface ProgressSummary {
  totalQuestions: number;
  completedQuestions: number;
  remainingQuestions: number;
  percentage: number;
  veryImportantTotal: number;
  veryImportantCompleted: number;
  unitProgress: Record<number, {
    total: number;
    completed: number;
    remaining: number;
    percentage: number;
  }>;
  topicProgress: Record<string, {
    total: number;
    completed: number;
    remaining: number;
    percentage: number;
  }>;
}
