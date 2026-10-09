import { Link, useParams } from "react-router-dom";
import { getAllChapters, getCourse } from "../../data/courses.js";
import { getProgress, saveProgress, getCourseProgress } from "../../utils/storage.js";
import ProgressBar from "../../components/ProgressBar.jsx";
import NotFound from "../NotFound.jsx";

export default function Course() {
  const { id, chapterId } = useParams();
  const course = getCourse(id);
  if (!course) return <NotFound />;
  const chapters = getAllChapters(course);
  const index = chapters.findIndex((chapter) => chapter.id === chapterId);
  if (index < 0) return <NotFound />;
  const chapter = chapters[index];
  const completed = getProgress()[course.id] || [];
  const isDone = completed.includes(chapter.id);
  const progress = getCourseProgress(course.id, course);

  function markDone() {
    const all = getProgress();
    const courseCompleted = all[course.id] || [];
    if (!courseCompleted.includes(chapter.id)) all[course.id] = [...courseCompleted, chapter.id];
    saveProgress(all);
    window.location.reload();
  }

  return <section className="page-section"><div className="container lesson-layout"><aside className="lesson-sidebar panel"><Link className="back-link" to={`/formations/${course.id}`}>← Détail de la formation</Link><h2>{course.title}</h2><ProgressBar value={progress} label="Progression" />{course.modules.map((module) => <div className="lesson-module" key={module.id}><h3>{module.title}</h3>{module.chapters.map((item) => <Link className={`lesson-nav-item ${item.id === chapter.id ? "current" : ""}`} to={`/formations/${course.id}/cours/${item.id}`} key={item.id}><span>{(getProgress()[course.id] || []).includes(item.id) ? "✓" : "○"}</span>{item.title}</Link>)}</div>)}</aside><article className="lesson-content panel"><div className="lesson-topline"><span className="eyebrow">LEÇON {index + 1} / {chapters.length}</span><span className={`pill ${isDone ? "pill-success" : ""}`}>{isDone ? "✓ Terminé" : "En cours"}</span></div><h1>{chapter.title}</h1><p className="lesson-intro">{chapter.content}</p><div className="lesson-video-placeholder"><span>▶</span><strong>Contenu du chapitre</strong><p>Zone réservée à une vidéo ou à une ressource pédagogique.</p><small>Cette démonstration fonctionne sans backend.</small></div><div className="lesson-note"><strong>À retenir</strong><p>Prends quelques notes, puis marque ce chapitre comme terminé pour enregistrer ta progression dans ton navigateur.</p></div><div className="lesson-actions">{index > 0 ? <Link className="button button-ghost" to={`/formations/${course.id}/cours/${chapters[index - 1].id}`}>← Chapitre précédent</Link> : <span />}{!isDone && <button className="button" onClick={markDone}>Marquer comme terminé ✓</button>}{isDone && index < chapters.length - 1 && <Link className="button" to={`/formations/${course.id}/cours/${chapters[index + 1].id}`}>Chapitre suivant →</Link>}{isDone && index === chapters.length - 1 && progress === 100 && <Link className="button" to={`/certificats/${course.id}`}>Voir mon certificat →</Link>}</div>{index < chapters.length - 1 && <div className="next-lesson"><span className="muted-text">Prochain chapitre</span><Link to={`/formations/${course.id}/cours/${chapters[index + 1].id}`}>{chapters[index + 1].title} →</Link></div>}</article></div></section>;
}
