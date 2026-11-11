import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllChapters, getCourse } from "../../data/courses.js";
import { getProgress, saveProgress, getCourseProgress, getVisitedChapters, saveLastChapter } from "../../utils/storage.js";
import ProgressBar from "../../components/ProgressBar.jsx";
import ModuleResources from "../../components/ModuleResources.jsx";
import Quiz from "../../components/Quiz.jsx";
import NotFound from "../NotFound.jsx";

export default function Course() {
  const { id, chapterId } = useParams();
  const course = getCourse(id);
  useEffect(() => {
    if (course && getAllChapters(course).some((chapter) => chapter.id === chapterId)) {
      saveLastChapter(course.id, chapterId);
    }
  }, [course, chapterId]);
  if (!course) return <NotFound />;
  const chapters = getAllChapters(course);
  const index = chapters.findIndex((chapter) => chapter.id === chapterId);
  if (index < 0) return <NotFound />;
  const chapter = chapters[index];
  const moduleIndex = course.modules.findIndex((module) => module.chapters.some((item) => item.id === chapter.id));
  const activeModule = course.modules[moduleIndex];
  const isModuleEnd = activeModule.chapters.at(-1)?.id === chapter.id;
  const nextModule = course.modules[moduleIndex + 1];
  const nextModuleUrl = nextModule
    ? `/formations/${course.id}/cours/${nextModule.chapters[0].id}`
    : null;
  const storedCompleted = getProgress()[course.id];
  const completed = Array.isArray(storedCompleted) ? storedCompleted : [];
  const visited = new Set(getVisitedChapters(course.id));
  const isDone = completed.includes(chapter.id);
  const progress = getCourseProgress(course.id, course);

  function markDone() {
    const all = getProgress();
    const storedCourseProgress = all[course.id];
    const courseCompleted = Array.isArray(storedCourseProgress) ? storedCourseProgress : [];
    if (!courseCompleted.includes(chapter.id)) all[course.id] = [...courseCompleted, chapter.id];
    saveProgress(all);
    window.location.reload();
  }

  return (
    <section className="page-section">
      <div className="container lesson-layout">
        <aside className="lesson-sidebar panel">
          <Link className="back-link" to={`/formations/${course.id}`}>← Détail de la formation</Link>
          <h2>{course.title}</h2>
          <ProgressBar value={progress} label="Progression" />
          {course.modules.map((module, index) => {
            const moduleCompleted = module.chapters.every((item) => completed.includes(item.id));
            return (
              <div className="lesson-module" key={module.id}>
                <div className="lesson-module-heading">
                  <h3>{module.order || index + 1}. {module.title}</h3>
                  <span className={moduleCompleted ? "is-complete" : "is-available"}>
                    {moduleCompleted ? "Terminé" : "Disponible"}
                  </span>
                </div>
                {module.chapters.map((item) => (
                  <Link
                    className={`lesson-nav-item ${item.id === chapter.id ? "current" : ""}`}
                    to={`/formations/${course.id}/cours/${item.id}`}
                    key={item.id}
                  >
                    <span className={completed.includes(item.id) ? "done" : visited.has(item.id) ? "visited" : ""}>
                      {completed.includes(item.id) ? "✓" : visited.has(item.id) ? "◉" : "○"}
                    </span>
                    {item.title}
                  </Link>
                ))}
              </div>
            );
          })}
        </aside>

        <article className="lesson-content panel">
          <div className="lesson-topline">
            <span className="eyebrow">LEÇON {index + 1} / {chapters.length}</span>
            <span className={`pill ${isDone ? "pill-success" : ""}`}>{isDone ? "✓ Terminé" : "En cours"}</span>
          </div>
          <h1>{chapter.title}</h1>
          <p className="lesson-intro">{chapter.content}</p>
          {chapter.videoUrl ? (
            <div className="lesson-video-placeholder has-video">
              <iframe
                src={chapter.videoEmbedUrl}
                title={`Vidéo : ${chapter.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <a href={chapter.videoUrl} target="_blank" rel="noreferrer">
                Ouvrir cette vidéo sur YouTube
              </a>
            </div>
          ) : (
            <div className="lesson-video-placeholder">
              <span>▶</span>
              <strong>Contenu du chapitre</strong>
              <p>Zone réservée à une vidéo ou à une ressource pédagogique.</p>
              <small>Cette démonstration fonctionne sans backend.</small>
            </div>
          )}
          <div className="lesson-note">
            <strong>À retenir</strong>
            <p>Prends quelques notes, puis marque ce chapitre comme terminé pour enregistrer ta progression dans ton navigateur.</p>
          </div>
          <ModuleResources
            resources={activeModule.resources}
            courseId={course.id}
            moduleId={activeModule.id}
          />
          {isModuleEnd && activeModule.quiz?.questions.length > 0 && (
            <Quiz
              key={activeModule.quiz.id}
              course={course}
              quiz={activeModule.quiz}
              moduleId={activeModule.id}
              moduleTitle={activeModule.title}
              nextUrl={nextModuleUrl}
            />
          )}
          <div className="lesson-actions">
            {index > 0
              ? <Link className="button button-ghost" to={`/formations/${course.id}/cours/${chapters[index - 1].id}`}>← Chapitre précédent</Link>
              : <span />}
            {!isDone && <button className="button" onClick={markDone}>Marquer comme terminé ✓</button>}
            {isDone && index < chapters.length - 1 && <Link className="button" to={`/formations/${course.id}/cours/${chapters[index + 1].id}`}>Chapitre suivant →</Link>}
            {isDone && index === chapters.length - 1 && progress === 100 && <Link className="button" to={`/certificats/${course.id}`}>Voir mon certificat →</Link>}
          </div>
          {index < chapters.length - 1 && (
            <div className="next-lesson">
              <span className="muted-text">Prochain chapitre</span>
              <Link to={`/formations/${course.id}/cours/${chapters[index + 1].id}`}>{chapters[index + 1].title} →</Link>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
