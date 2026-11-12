const PROGRESS_KEY = "learnspace-progress";
const PROFILE_KEY = "learnspace-profile";
const QUIZ_KEY = "learnspace-quiz-results";
const FAVORITES_KEY = "learnspace-favorites";
const STUDY_PLAN_KEY = "learnspace-study-plan";
const LAST_CHAPTER_KEY = "learnspace-last-chapter";
const VISITED_CHAPTERS_KEY = "learnspace-visited-chapters";
const RESOURCE_DOWNLOADS_KEY = "learnspace-resource-downloads";
const ENROLLMENTS_KEY = "learnspace-enrollments";

const defaultProfile = {
  firstName: "Étudiant",
  lastName: "LearnSpace",
  email: "",
  phone: "",
  bio: "Je progresse un cours à la fois.",
  photo: ""
};

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;

    const parsed = JSON.parse(value);
    return parsed === null ? fallback : parsed;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const getProgress = () => {
  const progress = read(PROGRESS_KEY, {});
  return progress && typeof progress === "object" && !Array.isArray(progress) ? progress : {};
};

export const saveProgress = (value) => write(PROGRESS_KEY, value);
export function getLastChapter(courseId) {
  const chapters = read(LAST_CHAPTER_KEY, {});
  return chapters && typeof chapters === "object" && !Array.isArray(chapters)
    ? chapters[courseId] || null
    : null;
}

export function saveLastChapter(courseId, chapterId) {
  const chapters = read(LAST_CHAPTER_KEY, {});
  const storedChapters = chapters && typeof chapters === "object" && !Array.isArray(chapters) ? chapters : {};
  write(LAST_CHAPTER_KEY, { ...storedChapters, [courseId]: chapterId });

  const visits = read(VISITED_CHAPTERS_KEY, {});
  const storedVisits = visits && typeof visits === "object" && !Array.isArray(visits) ? visits : {};
  const courseVisits = Array.isArray(storedVisits[courseId]) ? storedVisits[courseId] : [];
  if (!courseVisits.includes(chapterId)) {
    write(VISITED_CHAPTERS_KEY, { ...storedVisits, [courseId]: [...courseVisits, chapterId] });
  }
}

export function getVisitedChapters(courseId) {
  const visits = read(VISITED_CHAPTERS_KEY, {});
  return visits && typeof visits === "object" && !Array.isArray(visits) && Array.isArray(visits[courseId])
    ? visits[courseId]
    : [];
}

export function getResourceDownloads() {
  const downloads = read(RESOURCE_DOWNLOADS_KEY, []);
  return Array.isArray(downloads) ? downloads : [];
}

export function saveResourceDownload({ courseId, moduleId, resourceId }) {
  const downloads = getResourceDownloads();
  downloads.unshift({
    courseId,
    moduleId,
    resourceId,
    date: new Date().toISOString(),
  });
  write(RESOURCE_DOWNLOADS_KEY, downloads.slice(0, 100));
}

export function getEnrollments() {
  const enrollments = read(ENROLLMENTS_KEY, []);
  return Array.isArray(enrollments) ? enrollments : [];
}

export function saveEnrollment({ courseId, email, studentName }) {
  if (!courseId || !email) throw new TypeError("Une inscription doit inclure une formation et un compte étudiant.");
  const enrollments = getEnrollments();
  if (enrollments.some((item) => item.courseId === courseId && item.email === email)) return;
  write(ENROLLMENTS_KEY, [
    { courseId, email, studentName, enrolledAt: new Date().toISOString() },
    ...enrollments,
  ]);
}

export function removeEnrollment({ courseId, email }) {
  write(ENROLLMENTS_KEY, getEnrollments().filter((item) => item.courseId !== courseId || item.email !== email));
}

export function getResumeChapter(course) {
  const chapters = course.modules.flatMap((module) => module.chapters);
  if (!chapters.length) return null;

  const storedProgress = getProgress()[course.id];
  const completed = Array.isArray(storedProgress) ? storedProgress : [];
  const lastChapterId = getLastChapter(course.id);
  const lastChapter = chapters.find((chapter) => chapter.id === lastChapterId);
  if (lastChapter && !completed.includes(lastChapter.id)) return lastChapter;

  return chapters.find((chapter) => !completed.includes(chapter.id)) || lastChapter || chapters[0];
}

export const getProfile = () => {
  const profile = read(PROFILE_KEY, defaultProfile);
  if (!profile || typeof profile !== "object") {
    return { ...defaultProfile };
  }

  return { ...defaultProfile, ...profile };
};
export const saveProfile = (value) => write(PROFILE_KEY, value);
export const getQuizResults = () => {
  const results = read(QUIZ_KEY, []);
  return Array.isArray(results) ? results : [];
};
export const saveQuizResults = (value) => write(QUIZ_KEY, value);
export const getFavorites = () => {
  const favorites = read(FAVORITES_KEY, []);
  return Array.isArray(favorites) ? favorites : [];
};
export const saveFavorites = (value) => write(FAVORITES_KEY, value);

export function getStudyPlan(date) {
  const plans = read(STUDY_PLAN_KEY, {});
  return plans && typeof plans === "object" && !Array.isArray(plans) && Array.isArray(plans[date])
    ? plans[date]
    : [];
}

export function saveStudyPlan(date, completedTasks) {
  const plans = read(STUDY_PLAN_KEY, {});
  const storedPlans = plans && typeof plans === "object" && !Array.isArray(plans) ? plans : {};
  write(STUDY_PLAN_KEY, { ...storedPlans, [date]: completedTasks });
}

export function getCourseProgress(courseId, course) {
  const chapters = course.modules.flatMap((module) => module.chapters);
  if (!chapters.length) return 0;

  const storedProgress = getProgress()[courseId];
  const completed = new Set(Array.isArray(storedProgress) ? storedProgress : []);
  const completedCount = chapters.filter((chapter) => completed.has(chapter.id)).length;
  return Math.round((completedCount / chapters.length) * 100);
}
