import { useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, CirclePlay } from "lucide-react";
import { Link } from "react-router-dom";
import { courses as defaultCourses, getAllChapters, getCatalogCourses } from "../data/courses.js";
import { getDemoRole } from "../utils/demoAuth.js";
import { getProgress, saveProgress } from "../utils/storage.js";
import Quiz from "./Quiz.jsx";
import "./CourseVideoPlayer.css";

const initialCourses = getCatalogCourses();
const initialCourse = initialCourses.find((course) =>
  getAllChapters(course).some((chapter) => chapter.videoEmbedUrl)
) || initialCourses[0] || defaultCourses[0];

export default function CourseVideoPlayer() {
  const isStudent = getDemoRole() === "STUDENT";
  const courses = getCatalogCourses();
  const [activeCourseId, setActiveCourseId] = useState(initialCourse.id);
  const [activeLessonId, setActiveLessonId] = useState(getAllChapters(initialCourse)[0].id);
  const [completedByCourse, setCompletedByCourse] = useState(() => isStudent ? getProgress() : {});
  const [showQuiz, setShowQuiz] = useState(false);

  const activeCourse = courses.find((course) => course.id === activeCourseId) || initialCourse;
  const allLessons = getAllChapters(activeCourse);
  const activeLesson = allLessons.find((lesson) => lesson.id === activeLessonId) || allLessons[0];
  const completedLessons = completedByCourse[activeCourse.id] || [];
  const activeLessonIndex = allLessons.findIndex((lesson) => lesson.id === activeLesson.id);
  const progress = Math.round((completedLessons.length / allLessons.length) * 100);

  function selectCourse(course) {
    setActiveCourseId(course.id);
    setActiveLessonId(getAllChapters(course)[0].id);
    setShowQuiz(false);
  }

  function selectLesson(lesson) {
    setActiveLessonId(lesson.id);
    setShowQuiz(false);
  }

  function completeLesson() {
    if (!isStudent || completedLessons.includes(activeLesson.id)) return;

    const nextProgress = {
      ...completedByCourse,
      [activeCourse.id]: [...completedLessons, activeLesson.id],
    };
    saveProgress(nextProgress);
    setCompletedByCourse(nextProgress);
  }

  function moveLesson(offset) {
    const nextLesson = allLessons[activeLessonIndex + offset];
    if (nextLesson) selectLesson(nextLesson);
  }

  if (!isStudent) {
    return (
      <section className="dashboard-video-section">
        <div className="video-lesson-unavailable">
          <strong>Réservé à l’espace étudiant</strong>
          <span>Le compte administrateur n’a pas de progression pédagogique personnelle.</span>
          <Link to="/admin">Retour au Dashboard Admin</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-video-section">
      <header className="study-center-header">
        <span className="study-center-eyebrow"><CirclePlay size={16} /> APPRENDS AVEC NOS COURS VIDÉO</span>
        <h1>Cours vidéos</h1>
        <p>Sélectionne une formation et avance à ton rythme, chapitre après chapitre.</p>
      </header>

      <div className="video-course-player">
        <aside className="video-course-sidebar">
          <div className="video-course-sidebar-header">
            <span className="video-course-logo"><BookOpen size={20} /></span>
            <div>
              <h2>Mes formations</h2>
              <p>{activeCourse.title}</p>
            </div>
          </div>

          <div className="video-course-selector" aria-label="Choisir une formation">
            {courses.map((course) => (
              <button
                type="button"
                key={course.id}
                className={`video-course-choice ${activeCourse.id === course.id ? "active" : ""}`}
                onClick={() => selectCourse(course)}
              >
                {course.title}
              </button>
            ))}
          </div>

          <div className="video-course-progress">
            <div className="video-progress-info">
              <span>Progression</span>
              <strong>{progress}%</strong>
            </div>
            <div className="video-progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <nav className="video-course-modules" aria-label="Chapitres de la formation">
            {activeCourse.modules.map((module) => (
              <div className="video-course-module" key={module.id}>
                <h3>{module.title}</h3>
                {module.chapters.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <button
                      type="button"
                      key={lesson.id}
                      className={`video-lesson-item ${activeLesson.id === lesson.id ? "active" : ""}`}
                      onClick={() => selectLesson(lesson)}
                    >
                      <span className="video-lesson-status" aria-label={isCompleted ? "Terminé" : "Non terminé"}>
                        {isCompleted ? <CheckCircle2 size={16} /> : <CirclePlay size={16} />}
                      </span>
                      <span className="video-lesson-title">{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        <main className="video-course-main">
          <header className="video-course-topbar">
            <span>Formations / {activeCourse.title}</span>
            <span>Chapitre {activeLessonIndex + 1} sur {allLessons.length}</span>
          </header>

          <article className="video-lesson-content">
            <div className="video-lesson-heading">
              <span className="video-lesson-badge">LEÇON {activeLessonIndex + 1}</span>
              <h2>{activeLesson.title}</h2>
              <p>{activeCourse.description}</p>
            </div>

            {activeLesson.videoEmbedUrl ? (
              <div className="video-lesson-player">
                <iframe
                  src={activeLesson.videoEmbedUrl}
                  title={`Vidéo : ${activeLesson.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="video-lesson-unavailable">
                <CirclePlay size={28} />
                <strong>Vidéo non disponible pour ce chapitre</strong>
                <span>Tu peux tout de même consulter son contenu et suivre ta progression.</span>
              </div>
            )}

            <section className="video-lesson-text">
              <h3>Contenu de la leçon</h3>
              <p>{activeLesson.content}</p>
              {activeLesson.videoUrl && (
                <a href={activeLesson.videoUrl} target="_blank" rel="noreferrer">
                  Ouvrir cette vidéo sur YouTube <ArrowRight size={14} />
                </a>
              )}
            </section>

            {!showQuiz ? (
              <button className="video-quiz-start" type="button" onClick={() => setShowQuiz(true)}>
                Commencer le quiz de la formation →
              </button>
            ) : (
              <div className="video-course-quiz">
                <Quiz course={activeCourse} />
              </div>
            )}

            <footer className="video-lesson-footer">
              <button
                type="button"
                className="video-lesson-navigation"
                onClick={() => moveLesson(-1)}
                disabled={activeLessonIndex === 0}
              >
                <ChevronLeft size={16} /> Chapitre précédent
              </button>
              <button
                type="button"
                className="video-lesson-complete"
                onClick={completeLesson}
                disabled={completedLessons.includes(activeLesson.id)}
              >
                {completedLessons.includes(activeLesson.id) ? "✓ Leçon terminée" : "Marquer comme terminée"}
              </button>
              <button
                type="button"
                className="video-lesson-navigation"
                onClick={() => moveLesson(1)}
                disabled={activeLessonIndex === allLessons.length - 1}
              >
                Chapitre suivant <ChevronRight size={16} />
              </button>
            </footer>
          </article>
        </main>
      </div>
    </section>
  );
}
