import { getCertificateSettings } from "./adminSettings.js";
import { getQuizResults } from "./storage.js";
import { getCertificateEligibility } from "./certificateEligibility.js";
import { getProfile } from "./storage.js";

const TEMPLATES_KEY = "learnspace-certificate-templates";
const TEMPLATE_MIGRATION_KEY = "learnspace-certificate-professional-template-v1";
const ACTIVE_TEMPLATE_KEY = "learnspace-active-certificate-template";
const ISSUED_CERTIFICATES_KEY = "learnspace-issued-certificates";

const defaultTemplates = [
  {
    id: "modern-minimal",
    name: "Moderne minimaliste",
    category: "Moderne",
    description: "Une composition épurée avec beaucoup d’espace blanc et une ligne de couleur.",
    published: true,
    isDefault: true,
    format: "landscape",
    background: "#ffffff",
    accent: "#48bd7b",
    frame: "minimal",
    elements: [
      { id: "kicker", type: "text", content: "{{institution_name}} · CERTIFICAT DE RÉUSSITE", x: 9, y: 12, w: 82, h: 6, size: 2, color: "#597065", align: "center", weight: 700, font: "Arial" },
      { id: "title", type: "text", content: "Certificat de réussite", x: 10, y: 24, w: 80, h: 12, size: 5, color: "#162c22", align: "center", weight: 700, font: "Georgia" },
      { id: "intro", type: "text", content: "Ce certificat est décerné à", x: 10, y: 42, w: 80, h: 6, size: 2.2, color: "#66736c", align: "center", weight: 400, font: "Arial" },
      { id: "student", type: "text", content: "{{student_name}}", x: 13, y: 49, w: 74, h: 12, size: 4, color: "#183a29", align: "center", weight: 700, font: "Georgia" },
      { id: "course", type: "text", content: "pour avoir terminé avec succès la formation\n{{course_name}}", x: 12, y: 66, w: 76, h: 12, size: 2.4, color: "#40564a", align: "center", weight: 400, font: "Arial" },
      { id: "date", type: "text", content: "Délivré le {{completion_date}} · {{certificate_id}}", x: 10, y: 84, w: 80, h: 5, size: 1.8, color: "#77827b", align: "center", weight: 400, font: "Arial" },
      { id: "issuer", type: "text", content: "{{signature_name}}\n{{signature_title}}", x: 67, y: 72, w: 23, h: 12, size: 1.8, color: "#34473c", align: "center", weight: 600, font: "Georgia" },
    ],
  },
  {
    id: "academic-classic",
    name: "Académique classique",
    category: "Académique",
    description: "Une bordure institutionnelle et une hiérarchie typographique traditionnelle.",
    published: true,
    isDefault: false,
    format: "landscape",
    background: "#fffdf7",
    accent: "#254f75",
    frame: "academic",
    elements: [
      { id: "kicker", type: "text", content: "{{institution_name}}", x: 10, y: 10, w: 80, h: 6, size: 2.2, color: "#254f75", align: "center", weight: 700, font: "Georgia" },
      { id: "title", type: "text", content: "CERTIFICAT D’ACCOMPLISSEMENT", x: 8, y: 22, w: 84, h: 11, size: 4, color: "#183754", align: "center", weight: 700, font: "Georgia" },
      { id: "intro", type: "text", content: "L’institution reconnaît que", x: 10, y: 39, w: 80, h: 6, size: 2, color: "#596b78", align: "center", weight: 400, font: "Georgia" },
      { id: "student", type: "text", content: "{{student_name}}", x: 12, y: 47, w: 76, h: 12, size: 4.2, color: "#173d5e", align: "center", weight: 700, font: "Georgia" },
      { id: "course", type: "text", content: "a terminé le programme\n{{course_name}}", x: 12, y: 63, w: 76, h: 12, size: 2.4, color: "#435c6f", align: "center", weight: 400, font: "Georgia" },
      { id: "date", type: "text", content: "Date : {{completion_date}} · Référence : {{certificate_id}}", x: 9, y: 83, w: 82, h: 5, size: 1.7, color: "#63717b", align: "center", weight: 400, font: "Georgia" },
      { id: "issuer", type: "text", content: "{{signature_name}}\n{{signature_title}}", x: 67, y: 72, w: 24, h: 12, size: 1.8, color: "#274966", align: "center", weight: 600, font: "Georgia" },
    ],
  },
  {
    id: "black-gold",
    name: "Prestige noir & or",
    category: "Premium",
    description: "Un fond sombre, des accents dorés et une présentation haut de gamme.",
    published: true,
    isDefault: false,
    format: "landscape",
    background: "#121416",
    accent: "#d8b76a",
    frame: "premium",
    elements: [
      { id: "kicker", type: "text", content: "{{institution_name}} · DISTINCTION", x: 10, y: 11, w: 80, h: 6, size: 2, color: "#e1c678", align: "center", weight: 700, font: "Arial" },
      { id: "title", type: "text", content: "Certificate of Excellence", x: 9, y: 23, w: 82, h: 12, size: 4.5, color: "#f5e8bd", align: "center", weight: 700, font: "Georgia" },
      { id: "intro", type: "text", content: "This distinction is awarded to", x: 10, y: 41, w: 80, h: 6, size: 2, color: "#c5bdab", align: "center", weight: 400, font: "Georgia" },
      { id: "student", type: "text", content: "{{student_name}}", x: 12, y: 49, w: 76, h: 12, size: 4.2, color: "#e6cb81", align: "center", weight: 700, font: "Georgia" },
      { id: "course", type: "text", content: "for completing the program\n{{course_name}}", x: 10, y: 66, w: 80, h: 11, size: 2.3, color: "#e1ddce", align: "center", weight: 400, font: "Georgia" },
      { id: "date", type: "text", content: "{{completion_date}} · {{certificate_id}}", x: 9, y: 85, w: 82, h: 5, size: 1.7, color: "#c7b982", align: "center", weight: 400, font: "Arial" },
      { id: "issuer", type: "text", content: "{{signature_name}}\n{{signature_title}}", x: 67, y: 73, w: 23, h: 11, size: 1.8, color: "#e5d7ab", align: "center", weight: 600, font: "Georgia" },
    ],
  },
  {
    id: "green-modern",
    name: "LearnSpace vert & blanc",
    category: "Professionnel",
    description: "Un style LearnSpace lumineux avec un large bandeau vert et un sceau décoratif.",
    published: true,
    isDefault: false,
    format: "landscape",
    background: "#f7fff9",
    accent: "#16834a",
    frame: "green",
    elements: [
      { id: "kicker", type: "text", content: "{{institution_name}}", x: 10, y: 10, w: 80, h: 6, size: 2, color: "#176b3f", align: "center", weight: 800, font: "Arial" },
      { id: "title", type: "text", content: "CERTIFICAT DE FORMATION", x: 10, y: 23, w: 80, h: 11, size: 4, color: "#103a27", align: "center", weight: 800, font: "Arial" },
      { id: "intro", type: "text", content: "Décerné avec fierté à", x: 10, y: 40, w: 80, h: 6, size: 2, color: "#648071", align: "center", weight: 400, font: "Arial" },
      { id: "student", type: "text", content: "{{student_name}}", x: 12, y: 49, w: 76, h: 12, size: 4.2, color: "#176b3f", align: "center", weight: 800, font: "Arial" },
      { id: "course", type: "text", content: "pour avoir réussi la formation\n{{course_name}}", x: 10, y: 66, w: 80, h: 12, size: 2.3, color: "#3d5a49", align: "center", weight: 400, font: "Arial" },
      { id: "date", type: "text", content: "{{completion_date}} · {{certificate_id}}", x: 8, y: 85, w: 84, h: 5, size: 1.7, color: "#688072", align: "center", weight: 400, font: "Arial" },
      { id: "issuer", type: "text", content: "{{signature_name}}\n{{signature_title}}", x: 68, y: 74, w: 23, h: 10, size: 1.8, color: "#315940", align: "center", weight: 600, font: "Georgia" },
    ],
  },
  {
    id: "blue-silver",
    name: "Bleu & argent",
    category: "Professionnel",
    description: "Un modèle bleu profond avec un encadrement argenté contemporain.",
    published: true,
    isDefault: false,
    format: "landscape",
    background: "#f7faff",
    accent: "#536c91",
    frame: "silver",
    elements: [
      { id: "kicker", type: "text", content: "{{institution_name}} · FORMATION", x: 10, y: 11, w: 80, h: 6, size: 2, color: "#536c91", align: "center", weight: 700, font: "Arial" },
      { id: "title", type: "text", content: "Certificate of Completion", x: 9, y: 23, w: 82, h: 12, size: 4.1, color: "#263c5a", align: "center", weight: 700, font: "Georgia" },
      { id: "intro", type: "text", content: "This certificate is presented to", x: 10, y: 41, w: 80, h: 6, size: 2, color: "#6c7d91", align: "center", weight: 400, font: "Georgia" },
      { id: "student", type: "text", content: "{{student_name}}", x: 12, y: 49, w: 76, h: 12, size: 4.1, color: "#2d527d", align: "center", weight: 700, font: "Georgia" },
      { id: "course", type: "text", content: "for successfully completing\n{{course_name}}", x: 10, y: 66, w: 80, h: 12, size: 2.3, color: "#465f7e", align: "center", weight: 400, font: "Georgia" },
      { id: "date", type: "text", content: "{{completion_date}} · {{certificate_id}}", x: 9, y: 85, w: 82, h: 5, size: 1.7, color: "#748397", align: "center", weight: 400, font: "Arial" },
      { id: "issuer", type: "text", content: "{{signature_name}}\n{{signature_title}}", x: 68, y: 73, w: 23, h: 11, size: 1.8, color: "#344d6a", align: "center", weight: 600, font: "Georgia" },
    ],
  },
  {
    id: "professional-executive",
    name: "Institutionnel exécutif",
    category: "Professionnel",
    description: "Une présentation institutionnelle raffinée, bleu marine et or, avec une hiérarchie claire et une signature officielle.",
    published: true,
    isDefault: false,
    format: "landscape",
    background: "#fbfaf6",
    accent: "#b28a45",
    frame: "executive",
    elements: [
      { id: "kicker", type: "text", content: "{{institution_name}}  ·  ATTESTATION DE RÉUSSITE", x: 12, y: 10, w: 76, h: 6, size: 1.8, color: "#657184", align: "center", weight: 700, font: "Arial" },
      { id: "title", type: "text", content: "CERTIFICAT DE RÉUSSITE", x: 10, y: 21, w: 80, h: 11, size: 4.2, color: "#142b45", align: "center", weight: 700, font: "Georgia" },
      { id: "intro", type: "text", content: "La direction certifie que", x: 10, y: 37, w: 80, h: 6, size: 2, color: "#687486", align: "center", weight: 400, font: "Georgia" },
      { id: "student", type: "text", content: "{{student_name}}", x: 12, y: 45, w: 76, h: 12, size: 4.2, color: "#173451", align: "center", weight: 700, font: "Georgia" },
      { id: "course", type: "text", content: "a satisfait aux exigences de la formation\n{{course_name}}", x: 12, y: 60, w: 76, h: 12, size: 2.2, color: "#455568", align: "center", weight: 400, font: "Arial" },
      { id: "issuer", type: "text", content: "{{signature_name}}\n{{signature_title}}", x: 68, y: 75, w: 22, h: 10, size: 1.7, color: "#253b52", align: "center", weight: 600, font: "Georgia" },
      { id: "date", type: "text", content: "Délivré le {{completion_date}}  ·  Réf. {{certificate_id}}", x: 10, y: 87, w: 80, h: 5, size: 1.55, color: "#657184", align: "center", weight: 400, font: "Arial" },
    ],
  },
];

function readArray(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function getCertificateTemplates() {
  const saved = readArray(TEMPLATES_KEY, null);
  if (!saved) return structuredClone(defaultTemplates);
  if (localStorage.getItem(TEMPLATE_MIGRATION_KEY) === "1") return saved;

  const professionalTemplate = defaultTemplates.find((template) => template.id === "professional-executive");
  const templates = saved.some((template) => template.id === professionalTemplate.id)
    ? saved
    : [...saved, structuredClone(professionalTemplate)];
  saveCertificateTemplates(templates);
  localStorage.setItem(TEMPLATE_MIGRATION_KEY, "1");
  return templates;
}

export function saveCertificateTemplates(templates) {
  if (!Array.isArray(templates) || !templates.length || templates.some((template) => !template.id || !Array.isArray(template.elements))) {
    throw new TypeError("La bibliothèque doit contenir au moins un modèle valide.");
  }
  if (new Set(templates.map((template) => template.id)).size !== templates.length) {
    throw new TypeError("Chaque modèle doit avoir un identifiant unique.");
  }
  const defaults = templates.filter((template) => template.isDefault);
  if (defaults.length > 1) throw new TypeError("Un seul modèle peut être défini par défaut.");
  if (!templates.some((template) => template.published)) throw new TypeError("Publie au moins un modèle pour délivrer les certificats.");
  if (defaults.length === 1 && !defaults[0].published) throw new TypeError("Le modèle par défaut doit être publié.");
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function getActiveCertificateTemplate() {
  const templates = getCertificateTemplates();
  const activeId = localStorage.getItem(ACTIVE_TEMPLATE_KEY);
  return templates.find((template) => template.id === activeId && template.published)
    || templates.find((template) => template.isDefault && template.published)
    || templates.find((template) => template.published)
    || templates[0];
}

export function setActiveCertificateTemplate(templateId) {
  const template = getCertificateTemplates().find((item) => item.id === templateId && item.published);
  if (!template) throw new Error("Le modèle choisi n’est pas publié.");
  localStorage.setItem(ACTIVE_TEMPLATE_KEY, templateId);
}

function readIssuedCertificates() {
  return readArray(ISSUED_CERTIFICATES_KEY, []);
}

export function issueCertificate(course, eligibility = getCertificateEligibility(course, getCertificateSettings())) {
  if (!eligibility.eligible) throw new Error("Les conditions de délivrance ne sont pas remplies.");
  const profile = getProfile();
  const ownerEmail = profile.email?.trim().toLowerCase();
  if (!ownerEmail) throw new Error("Ajoute une adresse email au profil étudiant avant de générer un certificat.");
  const existing = readIssuedCertificates().find((item) => item.courseId === course.id && item.ownerEmail === ownerEmail);
  if (existing?.status === "valid") return existing;
  if (existing?.status === "revoked") throw new Error("Un certificat pour cette formation a été révoqué. Contacte l’équipe LearnSpace.");

  const activeTemplate = getActiveCertificateTemplate();
  const id = `LS-${new Date().getFullYear()}-${globalThis.crypto?.randomUUID?.().slice(0, 8).toUpperCase() || Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  const quizResults = getQuizResults().filter((result) => result.courseId === course.id);
  const record = {
    id,
    status: "valid",
    ownerEmail,
    studentName: `${profile.firstName} ${profile.lastName}`.trim(),
    courseId: course.id,
    courseName: course.title,
    instructorName: course.instructor || "",
    duration: course.duration || "",
    score: quizResults.length ? Math.max(...quizResults.map((result) => Number(result.score) || 0)) : null,
    completionDate: new Date().toISOString(),
    template: structuredClone(activeTemplate),
    settings: structuredClone(getCertificateSettings()),
  };
  const issued = readIssuedCertificates();
  localStorage.setItem(ISSUED_CERTIFICATES_KEY, JSON.stringify([record, ...issued]));
  return record;
}

export function getIssuedCertificates() {
  return readIssuedCertificates();
}

export function getIssuedCertificate(certificateId) {
  return readIssuedCertificates().find((certificate) => certificate.id === certificateId) || null;
}

export function getIssuedCertificateForStudent(courseId, ownerEmail) {
  const normalizedEmail = ownerEmail?.trim().toLowerCase();
  return readIssuedCertificates().find((certificate) =>
    certificate.courseId === courseId && certificate.ownerEmail === normalizedEmail && certificate.status === "valid",
  ) || null;
}

export function revokeIssuedCertificate(certificateId) {
  const certificates = readIssuedCertificates();
  const found = certificates.some((certificate) => certificate.id === certificateId);
  if (!found) throw new Error("Certificat introuvable.");
  localStorage.setItem(ISSUED_CERTIFICATES_KEY, JSON.stringify(certificates.map((certificate) =>
    certificate.id === certificateId ? { ...certificate, status: "revoked" } : certificate,
  )));
}

export function interpolateCertificateText(text, variables) {
  return text.replace(/\{\{([a-z_]+)\}\}/g, (match, key) => variables[key] ?? match);
}
