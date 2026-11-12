import { Link, useParams } from "react-router-dom";
import CertificateCanvas from "../../components/Certificates/CertificateCanvas.jsx";
import { getIssuedCertificate } from "../../utils/certificateTemplates.js";
import "./Certificate.css";

export default function CertificateVerification() {
  const { certificateId } = useParams();
  const certificate = getIssuedCertificate(certificateId);

  if (!certificate) {
    return (
      <section className="page-section certificate-verification">
        <div className="container narrow-container">
          <div className="panel locked-certificate">
            <h1>Certificat introuvable</h1>
            <p>Cette référence n’existe pas dans les certificats locaux de cette démonstration.</p>
            <Link className="button" to="/">Retour à l’accueil</Link>
          </div>
        </div>
      </section>
    );
  }

  const valid = certificate.status === "valid";
  const variables = {
    student_name: certificate.studentName,
    course_name: certificate.courseName,
    completion_date: new Date(certificate.completionDate).toLocaleDateString("fr-FR"),
    certificate_id: certificate.id,
    institution_name: certificate.settings.issuer,
    instructor_name: certificate.instructorName,
    duration: certificate.duration,
    score: certificate.score == null ? "—" : `${certificate.score}%`,
    signature_name: certificate.settings.signatureName || "Direction LearnSpace",
    signature_title: certificate.settings.signatureTitle,
  };

  return (
    <section className="page-section certificate-page-container">
      <div className="container certificate-page">
        <div className={`certificate-verification-status ${valid ? "is-valid" : "is-revoked"}`}>
          <strong>{valid ? "Certificat valide dans cette démonstration locale" : "Certificat révoqué"}</strong>
          <span>Référence : {certificate.id}</span>
        </div>
        <div className={`certificate-page-document ${certificate.template.format === "portrait" ? "is-portrait" : ""}`}>
          <CertificateCanvas template={certificate.template} variables={variables} preview />
        </div>
        <p className="certificate-local-disclaimer">Vérification locale uniquement : ce résultat provient du stockage de ce navigateur et ne constitue pas une preuve d’authenticité publique.</p>
        <Link className="button button-ghost" to="/">Retour à LearnSpace</Link>
      </div>
    </section>
  );
}
