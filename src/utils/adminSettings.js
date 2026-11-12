const SITE_SETTINGS_KEY = "learnspace-site-settings";
const CERTIFICATE_SETTINGS_KEY = "learnspace-certificate-settings";
const CATEGORIES_KEY = "learnspace-course-categories";

const defaultSiteSettings = {
  name: "LearnSpace",
  tagline: "Apprends aujourd'hui, construis ton avenir.",
  supportEmail: "husseindiallo65@gmail.com",
  accentColor: "#5FEB98",
};

function read(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function getSiteSettings() {
  return { ...defaultSiteSettings, ...read(SITE_SETTINGS_KEY, {}) };
}

export function saveSiteSettings(settings) {
  localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
}

export function getCertificateSettings() {
  return {
    enabled: true,
    title: "Certificat de réussite",
    kicker: "CERTIFICAT DE RÉUSSITE",
    description: "et complété avec succès les objectifs de cette formation.",
    issuer: "LearnSpace",
    issuerTitle: "Plateforme e-learning",
    signatureName: "",
    signatureTitle: "Direction pédagogique",
    accentColor: "#5FEB98",
    logoUrl: "",
    requireAllChapters: true,
    requireQuizPass: false,
    minimumQuizScore: 70,
    ...read(CERTIFICATE_SETTINGS_KEY, {}),
  };
}

export function saveCertificateSettings(settings) {
  if (!settings || typeof settings !== "object") {
    throw new TypeError("La configuration du certificat est invalide.");
  }
  for (const field of ["title", "kicker", "description", "issuer", "issuerTitle", "signatureTitle"]) {
    if (typeof settings[field] !== "string" || !settings[field].trim()) {
      throw new TypeError("Complète les textes obligatoires du certificat.");
    }
  }
  if (!/^#[0-9a-f]{6}$/i.test(settings.accentColor)) {
    throw new TypeError("La couleur du certificat doit être un code hexadécimal valide.");
  }
  if (settings.logoUrl) {
    try {
      const logoUrl = new URL(settings.logoUrl);
      if (!["http:", "https:"].includes(logoUrl.protocol)) throw new Error();
    } catch {
      throw new TypeError("L’URL du logo doit commencer par http:// ou https://.");
    }
  }
  const minimumQuizScore = Number(settings.minimumQuizScore);
  if (!Number.isInteger(minimumQuizScore) || minimumQuizScore < 0 || minimumQuizScore > 100) {
    throw new TypeError("Le seuil de réussite au quiz doit être compris entre 0 et 100.");
  }
  localStorage.setItem(CERTIFICATE_SETTINGS_KEY, JSON.stringify({
    ...settings,
    minimumQuizScore,
  }));
}

export function getCustomCategories() {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (!stored) return [];
    const categories = JSON.parse(stored);
    return Array.isArray(categories) ? categories.filter((category) => typeof category === "string") : [];
  } catch {
    return [];
  }
}

export function saveCustomCategories(categories) {
  if (!Array.isArray(categories) || categories.some((category) => typeof category !== "string" || !category.trim())) {
    throw new TypeError("Les catégories doivent être une liste de noms valides.");
  }
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify([...new Set(categories.map((category) => category.trim()))]));
}
