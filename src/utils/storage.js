const PROGRESS_KEY = "learnspace-progress";
const PROFILE_KEY = "learnspace-profile";
const QUIZ_KEY = "learnspace-quiz-results";
const FAVORITES_KEY = "learnspace-favorites";

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const getProgress = () => read(PROGRESS_KEY, {});
export const saveProgress = (value) => write(PROGRESS_KEY, value);
export const getProfile = () => read(PROFILE_KEY, {
  firstName: "Étudiant",
  lastName: "LearnSpace",
  email: "",
  phone: "",
  bio: "Je progresse un cours à la fois.",
  photo: ""
});
export const saveProfile = (value) => write(PROFILE_KEY, value);
export const getQuizResults = () => read(QUIZ_KEY, []);
export const saveQuizResults = (value) => write(QUIZ_KEY, value);
export const getFavorites = () => read(FAVORITES_KEY, []);
export const saveFavorites = (value) => write(FAVORITES_KEY, value);

export function getCourseProgress(courseId, course) {
  const progress = getProgress()[courseId] || [];
  const total = course.modules.reduce((sum, module) => sum + module.chapters.length, 0);
  return total ? Math.round((progress.length / total) * 100) : 0;
}
