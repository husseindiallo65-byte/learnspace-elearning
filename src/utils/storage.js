const PROGRESS_KEY = "learnspace-progress";
const PROFILE_KEY = "learnspace-profile";
const QUIZ_KEY = "learnspace-quiz-results";
const FAVORITES_KEY = "learnspace-favorites";
const STUDY_PLAN_KEY = "learnspace-study-plan";

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
  const progress = getProgress()[courseId] || [];
  const total = course.modules.reduce((sum, module) => sum + module.chapters.length, 0);
  return total ? Math.round((progress.length / total) * 100) : 0;
}
