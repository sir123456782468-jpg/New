/* home-preview-stub.js — بيانات تجريبية لمعاينة الصفحة الرئيسية جوه لوحة التحكم (بيتحمّل بس لما الصفحة تتفتح جوه iframe بـ ?hmpreview=1).
   مفيش أي اتصال بقاعدة البيانات ولا بحساب حقيقي: كل حاجة هنا بيانات وهمية. */
(function () {
'use strict';
if (!window.HM_PREVIEW && !window.HM_FORCE_STUB) return;
const day = n => new Date(Date.now() - n * 864e5).toISOString();
const YEAR = 'ثالثة ثانوي';
const PROFILE = { id: '00000000-0000-4000-8000-000000000001', first_name: 'أحمد', middle_name: 'محمد', last_name: 'علي', email: 'student@example.com', phone_number: '01012345678', parent_phone: '01087654321', academic_year: YEAR, created_at: day(60), is_blocked: false };
const COURSES = [
  { id: 'c1', num: 1, title: 'كورس القواعد الأساسية', description: 'كل قواعد اللغة الإنجليزية من الصفر لحد الاحتراف بشرح مبسط وتدريبات.', thumbnail_url: null, price: 0, academic_year: YEAR, lessons: [{ count: 12 }] },
  { id: 'c2', num: 2, title: 'كورس المحادثة والاستماع', description: 'تدريبات استماع ومحادثة يومية.', thumbnail_url: null, price: 250, academic_year: YEAR, lessons: [{ count: 8 }] },
  { id: 'c3', num: 3, title: 'مراجعة نهائية', description: 'مراجعة شاملة قبل الامتحان.', thumbnail_url: null, price: 0, academic_year: YEAR, lessons: [{ count: 5 }] },
  { id: 'c4', num: 4, title: 'كورس الكتابة والتعبير', description: 'إزاي تكتب مقال ورسالة بشكل صحيح.', thumbnail_url: null, price: 300, academic_year: YEAR, lessons: [{ count: 10 }] }
];
const PROG = [0, 0, 1, 1, 1, 2, 3, 3, 5, 6, 8, 9].map((d, i) => ({ lesson_id: 'l' + i, completed_at: day(d), lessons: { course_id: i % 3 === 0 ? 'c2' : 'c1' } }));
const ATT = [['امتحان القواعد 1', 18, 20], ['امتحان القواعد 2', 12, 20], ['امتحان المفردات', 9, 20], ['امتحان القراءة', 17, 20]].map((a, i) => ({ id: 'a' + i, quiz_id: 'q' + i, score: a[1], total: a[2], created_at: day(i * 3 + 1), visible: true, pass_override: false, title: a[0], pass_percent: 50 }));
const QUIZ = [{ id: 'q0', title: 'امتحان القواعد 1', kind: 'course', opens_at: null, closes_at: null, max_attempts: 3, courses: { title: 'كورس القواعد الأساسية' } },
  { id: 'q4', title: 'امتحان الوحدة الخامسة', kind: 'course', opens_at: null, closes_at: null, max_attempts: 1, courses: { title: 'كورس القواعد الأساسية' } },
  { id: 'q5', title: 'امتحان شامل على المنهج', kind: 'comprehensive', opens_at: new Date(Date.now() + 3 * 864e5).toISOString(), closes_at: null, max_attempts: 1, courses: null },
  { id: 'q6', title: 'امتحان قديم', kind: 'course', opens_at: null, closes_at: day(2), max_attempts: 1, courses: { title: 'مراجعة نهائية' } }];
const NOTIFS = [
  { ref: 'a:1', kind: 'announcement', title: 'مرحباً بكم في المنصة 🎉', body: 'نتمنى لكم عاماً دراسياً موفقاً', created_at: day(0.2), read: false },
  { ref: 'n:1', kind: 'exam', title: 'امتحان جديد: امتحان الوحدة الخامسة', body: null, link: '/quiz.html?id=q4', created_at: day(1), read: false },
  { ref: 'n:2', kind: 'lesson', title: 'محاضرة جديدة: Present Perfect', body: 'كورس القواعد الأساسية', link: '/course.html?id=c1', created_at: day(3), read: true }];
const RESULTS = [
  { quiz_id: 'q0', attempt_id: 'a0', quiz_title: 'امتحان القواعد 1', course_id: 'c1', course_title: 'كورس القواعد الأساسية', lesson_id: 'l1', lesson_title: 'Present Simple', lesson_position: 1, score: 18, total: 20, n_questions: 20, n_correct: 18, n_wrong: 2, n_unanswered: 0, attempts_used: 1, max_attempts: 3, pass_percent: 50, created_at: day(1), hidden: false },
  { quiz_id: 'q1', attempt_id: 'a1', quiz_title: 'امتحان القواعد 2', course_id: 'c1', course_title: 'كورس القواعد الأساسية', lesson_id: 'l2', lesson_title: 'Past Simple', lesson_position: 2, score: 8, total: 20, n_questions: 20, n_correct: 8, n_wrong: 11, n_unanswered: 1, attempts_used: 2, max_attempts: 2, pass_percent: 50, created_at: day(4), hidden: false },
  { quiz_id: 'q7', attempt_id: 'a7', quiz_title: 'امتحان مقالي', course_id: 'c2', course_title: 'كورس المحادثة والاستماع', lesson_id: 'l3', lesson_title: 'Writing', lesson_position: 1, score: 0, total: 10, created_at: day(2), hidden: true, hidden_reason: 'grading' }];
const LEVEL = { streak: 3, best_streak: 7, totals: { attempts: 6, avg_pct: 78, lessons_done: 12, watch_seconds: 5400, videos_heard: 4, perfect: 1, mistakes: 5 },
  courses: [{ title: 'كورس القواعد الأساسية', items: 12, items_done: 9, videos: 6, heard_sec: 1800, dur_sec: 2700, videos_heard: 4 }, { title: 'كورس المحادثة والاستماع', items: 8, items_done: 2, videos: 0 }],
  videos: [{ title: 'Present Simple — شرح', course: 'كورس القواعد الأساسية', lesson: 'المحاضرة 1', pct: 92, heard: 460, dur: 500 }], weak: [{ lesson: 'Past Simple', course: 'كورس القواعد الأساسية', pct: 40 }],
  exams: [{ title: 'امتحان القواعد 1', best: 90, tries: 1 }, { title: 'امتحان القواعد 2', best: 40, tries: 2 }] };
const MIST = [{ quiz_title: 'امتحان القواعد 2', created_at: day(4), question: 'She ____ to school every day.', options: ['go', 'goes', 'going', 'gone'], correct_index: 1, chosen_index: 0 }];
const RPC = {
  is_admin: false, session_ok: true, claim_session: null, account_gate: { blocked: false }, finalize_expired: 0,
  my_attempts_basic: ATT, my_notifications: NOTIFS, my_results: RESULTS, my_level: LEVEL, my_mistakes: MIST,
  my_quiz_extensions: [], my_assignments: [{ quiz_id: 'q4', note: 'راجع الوحدة قبل ما تبدأ', from_title: 'امتحان القواعد 2', at: day(1) }], support_my_threads: [], mark_all_read: null, mark_read: null
};
const TABLES = { profiles: PROFILE, courses: COURSES, enrollments: [{ course_id: 'c1' }, { course_id: 'c2' }], lesson_progress: PROG, quizzes: QUIZ, announcements: [], quiz_attempts: [] };
function Q(t) {
  let single = false; const q = {};
  ['select', 'eq', 'neq', 'order', 'limit', 'in', 'gte', 'lte', 'is', 'match', 'insert', 'update', 'delete', 'upsert', 'range', 'or', 'not'].forEach(m => { q[m] = () => q; });
  q.maybeSingle = q.single = () => { single = true; return q; };
  q.then = (res, rej) => Promise.resolve().then(() => { const d = TABLES[t]; const v = single ? (Array.isArray(d) ? d[0] || null : d || null) : (Array.isArray(d) ? d : d ? [d] : []); return { data: v, error: null, count: null }; }).then(res, rej);
  return q;
}
const clone = v => (v == null ? v : JSON.parse(JSON.stringify(v)));
window.HM_STUB = {
  auth: { getSession: async () => ({ data: { session: { user: { id: PROFILE.id, email: PROFILE.email } } } }), signOut: async () => ({}), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
  rpc: async name => ({ data: clone(Object.prototype.hasOwnProperty.call(RPC, name) ? RPC[name] : null), error: null }),
  from: t => Q(t),
  channel: () => ({ on() { return this; }, subscribe() { return this; } }), removeChannel() {}
};
window.HM_PROFILE = PROFILE;
})();
