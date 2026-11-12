import { getAllChapters } from "../data/courses.js";
import { getProgress, getQuizResults } from "./storage.js";

export function getCertificateEligibility(course, settings) {
  const completedChapters = getProgress()[course.id];
  const completedChapterIds = Array.isArray(completedChapters) ? completedChapters : [];
  const chapters = getAllChapters(course);
  const allChaptersCompleted = chapters.length > 0 && chapters.every((chapter) => completedChapterIds.includes(chapter.id));

  const moduleQuizzes = course.modules
    .filter((module) => module.quiz?.questions?.length)
    .map((module) => ({
      id: module.quiz.id || `${course.id}-${module.id}-quiz`,
      title: module.quiz.title || module.title,
      passingScore: Number(module.quiz.passingScore) || 0,
    }));
  const quizzes = moduleQuizzes.length
    ? moduleQuizzes
    : Array.isArray(course.quiz) && course.quiz.length
      ? [{ id: `${course.id}-final-quiz`, title: "Quiz de la formation", passingScore: 0 }]
      : [];
  const results = getQuizResults().filter((result) => result.courseId === course.id);
  const quizStatus = quizzes.map((quiz) => {
    const bestScore = results
      .filter((result) => result.quizId === quiz.id)
      .reduce((best, result) => Math.max(best, Number(result.score) || 0), -1);
    const requiredScore = Math.max(settings.minimumQuizScore, quiz.passingScore);
    return { ...quiz, bestScore, requiredScore, passed: bestScore >= requiredScore };
  });
  const allQuizzesPassed = quizStatus.every((quiz) => quiz.passed);
  const checks = [];

  if (settings.requireAllChapters) checks.push(allChaptersCompleted);
  if (settings.requireQuizPass) checks.push(allQuizzesPassed);

  return {
    eligible: checks.every(Boolean),
    allChaptersCompleted,
    allQuizzesPassed,
    quizStatus,
    chaptersCompleted: completedChapterIds.filter((id) => chapters.some((chapter) => chapter.id === id)).length,
    totalChapters: chapters.length,
  };
}
