import type { Question, ProgressSummary } from '../types';

export function calculateProgress(
  questions: Question[],
  completedIds: Set<string>
): ProgressSummary {
  const totalQuestions = questions.length;
  let completedQuestions = 0;
  let veryImportantTotal = 0;
  let veryImportantCompleted = 0;

  const unitMap: Record<number, { total: number; completed: number }> = {
    1: { total: 0, completed: 0 },
    2: { total: 0, completed: 0 },
    3: { total: 0, completed: 0 },
    4: { total: 0, completed: 0 },
    5: { total: 0, completed: 0 },
  };

  const topicMap: Record<string, { total: number; completed: number }> = {};

  for (const q of questions) {
    const isDone = completedIds.has(q.id);

    if (isDone) {
      completedQuestions++;
    }

    if (q.importance === 'VERY_IMPORTANT') {
      veryImportantTotal++;
      if (isDone) {
        veryImportantCompleted++;
      }
    }

    if (unitMap[q.unitId]) {
      unitMap[q.unitId].total++;
      if (isDone) {
        unitMap[q.unitId].completed++;
      }
    }

    if (!topicMap[q.topicId]) {
      topicMap[q.topicId] = { total: 0, completed: 0 };
    }
    topicMap[q.topicId].total++;
    if (isDone) {
      topicMap[q.topicId].completed++;
    }
  }

  const remainingQuestions = Math.max(0, totalQuestions - completedQuestions);
  const percentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  const unitProgress: ProgressSummary['unitProgress'] = {};
  for (const [uIdStr, data] of Object.entries(unitMap)) {
    const uId = Number(uIdStr);
    const rem = Math.max(0, data.total - data.completed);
    const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    unitProgress[uId] = {
      total: data.total,
      completed: data.completed,
      remaining: rem,
      percentage: pct,
    };
  }

  const topicProgress: ProgressSummary['topicProgress'] = {};
  for (const [tId, data] of Object.entries(topicMap)) {
    const rem = Math.max(0, data.total - data.completed);
    const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    topicProgress[tId] = {
      total: data.total,
      completed: data.completed,
      remaining: rem,
      percentage: pct,
    };
  }

  return {
    totalQuestions,
    completedQuestions,
    remainingQuestions,
    percentage,
    veryImportantTotal,
    veryImportantCompleted,
    unitProgress,
    topicProgress,
  };
}
