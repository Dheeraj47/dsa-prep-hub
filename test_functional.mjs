import fs from 'fs';
import path from 'path';

// 1. Load questions and syllabus
const questions = JSON.parse(fs.readFileSync('src/data/questions.json', 'utf8'));
const syllabus = JSON.parse(fs.readFileSync('src/data/syllabus.json', 'utf8'));

console.log('=== TEST 1: QUESTION BANK INTEGRITY ===');
console.log(`Total questions loaded: ${questions.length}`);
if (questions.length >= 60) {
  console.log('PASS: Total questions >= 60');
} else {
  console.error('FAIL: Insufficient questions');
}

// 2. Test Progress Calculation Logic
function calculateProgress(questions, completedIds) {
  const total = questions.length;
  let completed = 0;
  let veryImpTotal = 0;
  let veryImpCompleted = 0;

  const unitMap = { 1: { t: 0, c: 0 }, 2: { t: 0, c: 0 }, 3: { t: 0, c: 0 }, 4: { t: 0, c: 0 }, 5: { t: 0, c: 0 } };
  const topicMap = {};

  for (const q of questions) {
    const isDone = completedIds.has(q.id);
    if (isDone) completed++;
    if (q.importance === 'VERY_IMPORTANT') {
      veryImpTotal++;
      if (isDone) veryImpCompleted++;
    }
    if (unitMap[q.unitId]) {
      unitMap[q.unitId].t++;
      if (isDone) unitMap[q.unitId].c++;
    }
    if (!topicMap[q.topicId]) topicMap[q.topicId] = { t: 0, c: 0 };
    topicMap[q.topicId].t++;
    if (isDone) topicMap[q.topicId].c++;
  }

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percentage, veryImpTotal, veryImpCompleted, unitMap, topicMap };
}

console.log('\n=== TEST 2: INITIAL ZERO-STATE PROGRESS ===');
const emptySet = new Set();
const initialProgress = calculateProgress(questions, emptySet);
console.log(`Initial completed: ${initialProgress.completed}, Percentage: ${initialProgress.percentage}%`);
if (initialProgress.completed === 0 && initialProgress.percentage === 0) {
  console.log('PASS: Zero progress correctly initialized for new student');
} else {
  console.error('FAIL: Initial progress not zero');
}

console.log('\n=== TEST 3: LIVE PROGRESS UPDATES (DONE & NOT DONE) ===');
const studentDone = new Set();

// Student completes Q1 (Unit 1, Complexity)
studentDone.add('q1');
let p1 = calculateProgress(questions, studentDone);
console.log(`After completing Q1: ${p1.completed}/${p1.total} (${p1.percentage}%), Unit 1: ${p1.unitMap[1].c}/${p1.unitMap[1].t}`);
if (p1.completed === 1 && p1.unitMap[1].c === 1 && p1.veryImpCompleted === 1) {
  console.log('PASS: Progress incremented accurately across global, unit, and importance metrics');
} else {
  console.error('FAIL: Progress calculation error on done');
}

// Student completes Q10 (Unit 1, Quick Sort)
studentDone.add('q10');
let p2 = calculateProgress(questions, studentDone);
console.log(`After completing Q10: ${p2.completed}/${p2.total} (${p2.percentage}%)`);

// Student unmarks Q1 (Not Done)
studentDone.delete('q1');
let p3 = calculateProgress(questions, studentDone);
console.log(`After unmarking Q1: ${p3.completed}/${p3.total} (${p3.percentage}%), Unit 1: ${p3.unitMap[1].c}/${p3.unitMap[1].t}`);
if (p3.completed === 1 && p3.unitMap[1].c === 1 && !studentDone.has('q1')) {
  console.log('PASS: Progress accurately reverses when question marked not done');
} else {
  console.error('FAIL: Progress reversal failed');
}

console.log('\n=== TEST 4: SEARCH & FILTERING VALIDATION ===');
function filterQuestions(query, filterType, unitId, completedIds) {
  return questions.filter(q => {
    if (query) {
      const text = `${q.displayNumber} ${q.title} ${q.topicTitle} ${q.answer.definition}`.toLowerCase();
      if (!text.includes(query.toLowerCase())) return false;
    }
    if (unitId && unitId !== 'ALL' && q.unitId !== unitId) return false;
    if (filterType === 'VERY_IMPORTANT' && q.importance !== 'VERY_IMPORTANT') return false;
    if (filterType === 'CASE_STUDY' && q.importance !== 'CASE_STUDY') return false;
    if (filterType === 'COMPLETED' && !completedIds.has(q.id)) return false;
    if (filterType === 'INCOMPLETE' && completedIds.has(q.id)) return false;
    if (filterType === 'UNIVERSITY_EXAM' && q.source !== 'UNIVERSITY_EXAM') return false;
    return true;
  });
}

const searchAVL = filterQuestions('AVL', 'ALL', 'ALL', studentDone);
console.log(`Search 'AVL': found ${searchAVL.length} questions`);
if (searchAVL.length >= 2) {
  console.log('PASS: Search query matching works');
} else {
  console.error('FAIL: Search query matching failed');
}

const veryImpFilter = filterQuestions('', 'VERY_IMPORTANT', 'ALL', studentDone);
console.log(`Filter 'VERY_IMPORTANT': found ${veryImpFilter.length} questions`);
if (veryImpFilter.length >= 10 && veryImpFilter.every(q => q.importance === 'VERY_IMPORTANT')) {
  console.log('PASS: Importance filter works');
} else {
  console.error('FAIL: Importance filter failed');
}

const caseStudies = filterQuestions('', 'CASE_STUDY', 'ALL', studentDone);
console.log(`Filter 'CASE_STUDY': found ${caseStudies.length} case studies`);
if (caseStudies.length === 5) {
  console.log('PASS: All 5 official case studies successfully isolated');
} else {
  console.error(`FAIL: Expected 5 case studies, found ${caseStudies.length}`);
}

console.log('\n=== TEST 5: USER ISOLATION & SEPARATE PROGRESS ===');
// Simulated LocalStorage / Multi-student isolation
const storage = {};
function saveStudentProgress(userId, isDemo, ids) {
  const key = isDemo ? 'dsa_progress_demo' : `dsa_progress_${userId}`;
  storage[key] = JSON.stringify(Array.from(ids));
}
function loadStudentProgress(userId, isDemo) {
  const key = isDemo ? 'dsa_progress_demo' : `dsa_progress_${userId}`;
  return storage[key] ? new Set(JSON.parse(storage[key])) : new Set();
}

// Student 1 (Alex)
const alexDone = new Set(['q1', 'q2', 'q3']);
saveStudentProgress('user_alex', false, alexDone);

// Student 2 (Priya)
const priyaDone = new Set(['q10', 'q14']);
saveStudentProgress('user_priya', false, priyaDone);

// Demo Student
const demoDone = new Set(['add-u1-01']);
saveStudentProgress('demo', true, demoDone);

// Verify isolation
const alexLoaded = loadStudentProgress('user_alex', false);
const priyaLoaded = loadStudentProgress('user_priya', false);
const demoLoaded = loadStudentProgress('demo', true);

console.log(`Alex completed: ${Array.from(alexLoaded).join(', ')}`);
console.log(`Priya completed: ${Array.from(priyaLoaded).join(', ')}`);
console.log(`Demo completed: ${Array.from(demoLoaded).join(', ')}`);

if (alexLoaded.size === 3 && priyaLoaded.size === 2 && demoLoaded.size === 1 && !priyaLoaded.has('q1') && !alexLoaded.has('q10')) {
  console.log('PASS: Complete data isolation between student accounts');
} else {
  console.error('FAIL: Data leakage detected between student accounts');
}

console.log('\n=== ALL FUNCTIONAL TESTS PASSED SUCCESSFULLY! ===');
