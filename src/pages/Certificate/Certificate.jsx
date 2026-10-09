import { Link, useParams } from "react-router-dom";
import { getCourse } from "../../data/courses.js";
import { getCourseProgress, getQuizResults } from "../../utils/storage.js";
import { getProfile } from "../../utils/storage.js";
import NotFound from "../NotFound.jsx";

export default function Certificate() {
  const { id } = useParams();
  const course = getCourse(id);
  if (!course) return <NotFound />;
  const progress = getCourseProgress(course.id, course);
  const profile = getProfile();
  const bestResult = getQuizResults().filter((item) => item.courseId === course.id).sort((a,b) => b.score - a.score)[0];

  if (progress < 100) return <section className="page-section"><div className="container narrow-container"><div className="panel locked-certificate"><span>🔒</span><h1>Certificat pas encore disponible</h1><p>Termine tous les chapitres de <strong>{course.title}</strong> pour débloquer ton certificat simulé.</p><Link className="button" to={`/formations/${course.id}`}>Reprendre la formation</Link></div></div></section>;

  return <section className="page-section"><div className="container certificate-page"><div className="page-heading"><span className="eyebrow">FÉLICITATIONS POUR TON PARCOURS</span><h1>Ton certificat</h1><p>Tu as terminé tous les chapitres de cette formation.</p></div><article className="certificate-paper"><div className="certificate-border"><div className="certificate-mark">LS</div><span className="certificate-kicker">LEARNSPACE · CERTIFICAT DE RÉUSSITE</span><h2>Certificat de réussite</h2><p className="certificate-intro">Ce certificat est décerné à</p><div className="certificate-name">{profile.firstName} {profile.lastName}</div><p className="certificate-intro">pour avoir terminé avec succès la formation</p><h3>{course.title}</h3><p className="certificate-description">et complété les chapitres pédagogiques proposés dans ce parcours d'apprentissage.</p><div className="certificate-details"><div><span>Date d'obtention</span><strong>{new Date().toLocaleDateString("fr-FR")}</strong></div><div><span>Score du meilleur quiz</span><strong>{bestResult ? `${bestResult.score}%` : "Quiz non réalisé"}</strong></div></div><div className="certificate-footer"><span>LearnSpace<br/>Plateforme e-learning</span><span className="certificate-seal">✓</span></div><p className="certificate-disclaimer">Certificat simulé — projet pédagogique frontend.</p></div></article><div className="certificate-actions"><button className="button" onClick={() => window.print()}>Imprimer / Enregistrer en PDF</button><Link className="button button-ghost" to="/dashboard">Retour au tableau de bord</Link></div></div></section>;
}
