import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourse } from "../../data/courses.js";
import { Award } from "lucide-react";
import CertificateCanvas from "../../components/Certificates/CertificateCanvas.jsx";
import { getDemoRole } from "../../utils/demoAuth.js";
import { getCertificateSettings } from "../../utils/adminSettings.js";
import { getCertificateEligibility } from "../../utils/certificateEligibility.js";
import { getQuizResults } from "../../utils/storage.js";
import { getProfile } from "../../utils/storage.js";
import { getIssuedCertificateForStudent, issueCertificate } from "../../utils/certificateTemplates.js";
import NotFound from "../NotFound.jsx";
import "./Certificate.css";

function getCertificateVariables(record) {
  const date = new Date(record.completionDate);
  return {
    student_name: record.studentName,
    course_name: record.courseName,
    completion_date: date.toLocaleDateString("fr-FR"),
    certificate_id: record.id,
    institution_name: record.settings.issuer,
    instructor_name: record.instructorName,
    duration: record.duration,
    score: record.score == null ? "—" : `${record.score}%`,
    signature_name: record.settings.signatureName || "Direction LearnSpace",
    signature_title: record.settings.signatureTitle,
  };
}

export default function CertificatePage() {
  const { id } = useParams();
  const course = useMemo(() => getCourse(id), [id]);
  const role = getDemoRole();
  const settings = getCertificateSettings();
  const eligibility = course ? getCertificateEligibility(course, settings) : null;
  const profile = getProfile();
  const [record, setRecord] = useState(() => getIssuedCertificateForStudent(id, profile.email));
  const [issueError, setIssueError] = useState("");
  const bestResult = course
    ? getQuizResults().filter((item) => item.courseId === course.id).sort((a, b) => b.score - a.score)[0]
    : null;
  const variables = useMemo(() => record ? getCertificateVariables(record) : {}, [record]);

  useEffect(() => {
    if (role !== "STUDENT" || !course || !settings.enabled || !eligibility?.eligible) return;
    try {
      setRecord(getIssuedCertificateForStudent(course.id, profile.email) || issueCertificate(course, eligibility));
      setIssueError("");
    } catch (error) {
      setIssueError(error instanceof Error ? error.message : "Le certificat n’a pas pu être généré.");
    }
  }, [role, course, settings.enabled, eligibility?.eligible, profile.email]);

  if (role !== "STUDENT") {
    return <section className="page-section"><div className="container narrow-container"><div className="panel locked-certificate"><h1>Certificats réservés aux étudiants</h1><p>Un compte administrateur ne possède pas de certificat étudiant.</p><Link className="button" to="/admin">Retour au Dashboard Admin</Link></div></div></section>;
  }
  if (!course) return <NotFound />;
  if (!settings.enabled) {
    return <section className="page-section"><div className="container narrow-container"><div className="panel locked-certificate"><h1>Certificats temporairement désactivés</h1><p>L’administrateur a désactivé la consultation des certificats.</p><Link className="button" to="/dashboard">Retour au tableau de bord</Link></div></div></section>;
  }
  if (!eligibility.eligible) {
    return (
      <section className="page-section">
        <div className="container narrow-container">
          <div className="panel locked-certificate">
            <span>🔒</span><h1>Certificat pas encore disponible</h1>
            <p>Remplis les conditions définies pour <strong>{course.title}</strong>.</p>
            <ul>
              {settings.requireAllChapters && !eligibility.allChaptersCompleted && <li>Chapitres terminés : {eligibility.chaptersCompleted}/{eligibility.totalChapters}</li>}
              {settings.requireQuizPass && eligibility.quizStatus.filter((quiz) => !quiz.passed).map((quiz) => <li key={quiz.id}>{quiz.title} : {quiz.bestScore < 0 ? "à réaliser" : `${quiz.bestScore}% (minimum ${quiz.requiredScore}%)`}</li>)}
            </ul>
            <Link className="button" to={`/course/${course.id}`}>Reprendre la formation</Link>
          </div>
        </div>
      </section>
    );
  }
  if (issueError) {
    return <section className="page-section"><div className="container narrow-container"><div className="panel locked-certificate"><h1>Certificat indisponible</h1><p role="alert">{issueError}</p><Link className="button" to="/dashboard">Retour au tableau de bord</Link></div></div></section>;
  }
  if (!record) return <section className="page-section"><div className="container narrow-container"><div className="panel locked-certificate"><h1>Préparation du certificat…</h1></div></div></section>;

  return (
    <section className="page-section certificate-page-container">
      <div className="container certificate-page">
        <div className="page-heading certificate-screen-heading">
          <span className="eyebrow">FÉLICITATIONS POUR TON PARCOURS</span>
          <h1>Ton certificat</h1>
          <p>Tu as rempli les conditions de réussite de cette formation.</p>
        </div>
        <div className={`certificate-page-document ${record.template.format === "portrait" ? "is-portrait" : ""}`}>
          <CertificateCanvas template={record.template} variables={variables} preview />
        </div>
        <div className="certificate-issued-details">
          <span><strong>Étudiant</strong>{record.studentName || `${profile.firstName} ${profile.lastName}`}</span>
          <span><strong>Formation</strong>{record.courseName}</span>
          <span><strong>Délivré le</strong>{new Date(record.completionDate).toLocaleDateString("fr-FR")}</span>
          <span><strong>Référence</strong>{record.id}</span>
          <span><strong>Meilleur score</strong>{bestResult ? `${bestResult.score}%` : "Non applicable"}</span>
        </div>
        <p className="certificate-local-disclaimer">Certificat enregistré dans cette démonstration locale. Son numéro ne peut pas être vérifié depuis un autre navigateur.</p>
        <div className="certificate-actions">
          <button className="button" onClick={() => window.print()}><Award size={16} /> Imprimer / Enregistrer en PDF</button>
          <Link className="button button-ghost" to={`/verify-certificate/${encodeURIComponent(record.id)}`}>Voir la page de vérification</Link>
          <Link className="button button-ghost" to="/dashboard">Retour au tableau de bord</Link>
        </div>
      </div>
    </section>
  );
}
