import { Link, useParams } from "react-router-dom";
import { getCourse } from "../../data/courses.js";
import { getDemoRole } from "../../utils/demoAuth.js";
import { getCertificateSettings } from "../../utils/adminSettings.js";
import { getCertificateEligibility } from "../../utils/certificateEligibility.js";
import { getQuizResults } from "../../utils/storage.js";
import { getProfile } from "../../utils/storage.js";
import NotFound from "../NotFound.jsx";

export default function Certificate() {
  const { id } = useParams();
  if (getDemoRole() !== "STUDENT") {
    return <section className="page-section"><div className="container narrow-container"><div className="panel locked-certificate"><h1>Certificats réservés aux étudiants</h1><p>Un compte administrateur ne possède pas de certificat étudiant.</p><Link className="button" to="/admin">Retour au Dashboard Admin</Link></div></div></section>;
  }
  const course = getCourse(id);
  if (!course) return <NotFound />;
  const certificateSettings = getCertificateSettings();
  if (!certificateSettings.enabled) {
    return <section className="page-section"><div className="container narrow-container"><div className="panel locked-certificate"><h1>Certificats temporairement désactivés</h1><p>L’administrateur a désactivé la consultation des certificats.</p><Link className="button" to="/dashboard">Retour au tableau de bord</Link></div></div></section>;
  }
  const eligibility = getCertificateEligibility(course, certificateSettings);
  const profile = getProfile();
  const bestResult = getQuizResults().filter((item) => item.courseId === course.id).sort((a,b) => b.score - a.score)[0];

  if (!eligibility.eligible) return <section className="page-section"><div className="container narrow-container"><div className="panel locked-certificate"><span>🔒</span><h1>Certificat pas encore disponible</h1><p>Remplis les conditions définies pour <strong>{course.title}</strong>.</p><ul>{certificateSettings.requireAllChapters && !eligibility.allChaptersCompleted && <li>Chapitres terminés : {eligibility.chaptersCompleted}/{eligibility.totalChapters}</li>}{certificateSettings.requireQuizPass && eligibility.quizStatus.filter((quiz) => !quiz.passed).map((quiz) => <li key={quiz.id}>{quiz.title} : {quiz.bestScore < 0 ? "à réaliser" : `${quiz.bestScore}% (minimum ${quiz.requiredScore}%)`}</li>)}</ul><Link className="button" to={`/course/${course.id}`}>Reprendre la formation</Link></div></div></section>;

  return (
    <section className="page-section">
      <div className="container certificate-page">
        <div className="page-heading">
          <span className="eyebrow">FÉLICITATIONS POUR TON PARCOURS</span>
          <h1>Ton certificat</h1>
          <p>Tu as rempli les conditions de réussite de cette formation.</p>
        </div>
        <article className="certificate-paper" style={{ "--certificate-accent": certificateSettings.accentColor }}>
          <div className="certificate-border">
            {certificateSettings.logoUrl
              ? <img className="certificate-logo" src={certificateSettings.logoUrl} alt={`Logo ${certificateSettings.issuer}`} />
              : <div className="certificate-mark">LS</div>}
            <span className="certificate-kicker">{certificateSettings.issuer} · {certificateSettings.kicker}</span>
            <h2>{certificateSettings.title}</h2>
            <p className="certificate-intro">Ce certificat est décerné à</p>
            <div className="certificate-name">{profile.firstName} {profile.lastName}</div>
            <p className="certificate-intro">pour avoir terminé avec succès la formation</p>
            <h3>{course.title}</h3>
            <p className="certificate-description">{certificateSettings.description}</p>
            <div className="certificate-details">
              <div><span>Date d’obtention</span><strong>{new Date().toLocaleDateString("fr-FR")}</strong></div>
              <div><span>Score du meilleur quiz</span><strong>{bestResult ? `${bestResult.score}%` : "Quiz non réalisé"}</strong></div>
            </div>
            <div className="certificate-footer">
              <span>{certificateSettings.issuer}<br />{certificateSettings.issuerTitle}</span>
              <span className="certificate-seal">✓</span>
            </div>
            {certificateSettings.signatureName && (
              <div className="certificate-signature">
                <strong>{certificateSettings.signatureName}</strong>
                <span>{certificateSettings.signatureTitle}</span>
              </div>
            )}
            <p className="certificate-disclaimer">Certificat simulé — projet pédagogique frontend.</p>
          </div>
        </article>
        <div className="certificate-actions">
          <button className="button" onClick={() => window.print()}>Imprimer / Enregistrer en PDF</button>
          <Link className="button button-ghost" to="/dashboard">Retour au tableau de bord</Link>
        </div>
      </div>
    </section>
  );
}
