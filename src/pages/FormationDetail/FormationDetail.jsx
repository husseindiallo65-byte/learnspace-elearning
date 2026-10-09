import { Link, useParams } from "react-router-dom";
import { getAllChapters, getCourse } from "../../data/courses.js";
import { getCourseProgress, getProgress } from "../../utils/storage.js";
import ProgressBar from "../../components/ProgressBar.jsx";
import Quiz from "../../components/Quiz.jsx";
import NotFound from "../NotFound.jsx";
import courseDesignImage from "../../assets/course-design.webp";
import courseMarketingImage from "../../assets/course-marketing.webp";
import courseOfficeImage from "../../assets/course-office.webp";
import courseReactImage from "../../assets/course-react.webp";

export default function FormationDetail() {
  const { id } = useParams();
  const course = getCourse(id);
  if (!course) return <NotFound />;
  const completed = getProgress()[course.id] || [];
  const progress = getCourseProgress(course.id, course);
  const firstChapter = getAllChapters(course)[0];

  return <section className="page-section"><div className="container"><Link className="back-link" to="/formations">← Retour au catalogue</Link><div className="detail-hero panel"><div className={`detail-art art-${course.color}`}>{course.id === "marketing-digital" ? <img className="detail-art-image" src={courseMarketingImage} alt="" /> : course.id === "design-graphique" ? <img className="detail-art-image" src={courseDesignImage} alt="" /> : course.id === "react-debutant" ? <img className="detail-art-image" src={courseReactImage} alt="" /> : course.id === "bureautique" ? <img className="detail-art-image" src={courseOfficeImage} alt="" /> : <span>{course.icon}</span>}</div><div className="detail-copy"><span className="eyebrow">{course.category}</span><h1>{course.title}</h1><p>{course.description}</p><div className="detail-facts"><span>◷ {course.duration}</span><span>◎ {course.level}</span><span>★ {course.rating}</span><span>♙ {course.students.toLocaleString("fr-FR")} étudiants</span></div><p className="instructor">Formateur : <strong>{course.instructor}</strong></p><Link className="button button-fill-left button-primary-hover" to={`/formations/${course.id}/cours/${firstChapter.id}`}><span>{progress > 0 ? "Continuer la formation →" : "Commencer la formation →"}</span></Link></div></div>
    <div className="detail-columns"><div className="detail-main"><section className="panel content-panel"><span className="eyebrow">CE QUE TU VAS APPRENDRE</span><h2>Objectifs pédagogiques</h2><ul className="check-list">{course.objectives.map((objective) => <li key={objective}>✓ <span>{objective}</span></li>)}</ul></section><section className="panel content-panel"><div className="panel-heading"><div><span className="eyebrow">LE PROGRAMME</span><h2>Modules et chapitres</h2></div><span className="pill">{completed.length}/{getAllChapters(course).length} terminés</span></div>{course.modules.map((module) => <div className="module-block" key={module.id}><h3>{module.title}</h3>{module.chapters.map((chapter, index) => <Link className="chapter-row" to={`/formations/${course.id}/cours/${chapter.id}`} key={chapter.id}><span className={`chapter-number ${completed.includes(chapter.id) ? "done" : ""}`}>{completed.includes(chapter.id) ? "✓" : index + 1}</span><span>{chapter.title}</span><span className="chapter-arrow">→</span></Link>)}</div>)}</section></div><aside className="detail-aside"><div className="panel content-panel"><h3>Ta progression</h3><ProgressBar value={progress} label="Formation terminée" />{progress === 100 ? <Link className="button button-full" to={`/certificats/${course.id}`}>Voir mon certificat</Link> : <p className="muted-text">Termine tous les chapitres pour débloquer ton certificat simulé.</p>}</div><div className="panel content-panel"><h3>Cette formation comprend</h3><ul className="plain-list"><li>✓ {getAllChapters(course).length} chapitres</li><li>✓ Quiz de révision</li><li>✓ Suivi de progression</li><li>✓ Certificat simulé</li></ul></div></aside></div><Quiz course={course} /></div></section>;
}
