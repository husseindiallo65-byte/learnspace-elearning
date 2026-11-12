import { useEffect, useMemo, useState } from "react";
import { getCategories } from "../../data/courses.js";
import { deleteDemoStudentAccount, getDemoAccount, updateDemoStudentAccount } from "../../utils/demoAuth.js";
import {
  getCertificateSettings,
  getCustomCategories,
  getSiteSettings,
  saveCertificateSettings,
  saveCustomCategories,
  saveSiteSettings,
} from "../../utils/adminSettings.js";
import { getEnrollments, getProgress, getQuizResults, getResourceDownloads, removeEnrollment } from "../../utils/storage.js";

function parseJson(value, label) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`${label} doit contenir un JSON valide.`);
  }
}

function isValidQuestion(question) {
  if (typeof question?.question !== "string" || !Array.isArray(question.options) || question.options.length < 2) return false;
  const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
  return answers.length > 0 && answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer < question.options.length);
}

function AdminTools({ section, courses, onSaveCourses }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const selectedCourse = courses.find((course) => course.id === selectedCourseId);
  const [modulesJson, setModulesJson] = useState("");
  const [quizzesJson, setQuizzesJson] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");
  const [customCategories, setCustomCategories] = useState(getCustomCategories);
  const [siteSettings, setSiteSettings] = useState(getSiteSettings);
  const [certificateSettings, setCertificateSettings] = useState(getCertificateSettings);
  const [studentAccount, setStudentAccount] = useState(getDemoAccount);
  const [userForm, setUserForm] = useState(() => {
    const account = getDemoAccount();
    return { firstName: account?.firstName || "", lastName: account?.lastName || "", suspended: Boolean(account?.suspended) };
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedCourse) return;
    setModulesJson(JSON.stringify(selectedCourse.modules || [], null, 2));
    setQuizzesJson(JSON.stringify({
      courseQuiz: selectedCourse.quiz || [],
      moduleQuizzes: (selectedCourse.modules || []).map((module) => ({ moduleId: module.id, quiz: module.quiz || null })),
    }, null, 2));
  }, [selectedCourse]);

  const localProgress = getProgress();
  const quizResults = getQuizResults();
  const downloads = getResourceDownloads();
  const [enrollments, setEnrollments] = useState(getEnrollments);
  const progressRows = useMemo(() => courses.map((course) => ({
    course,
    completed: Array.isArray(localProgress[course.id]) ? localProgress[course.id].length : 0,
    total: (course.modules || []).reduce((count, module) => count + (module.chapters || []).length, 0),
  })), [courses, localProgress]);

  function showSave(action) {
    setNotice("");
    setError("");
    try {
      action();
      setNotice("Modifications enregistrées dans ce navigateur.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible d’enregistrer les modifications.");
    }
  }

  function saveModules(event) {
    event.preventDefault();
    showSave(() => {
      const modules = parseJson(modulesJson, "Les modules");
      if (!Array.isArray(modules) || modules.some((module) =>
        !module.id
        || !Array.isArray(module.chapters)
        || module.chapters.some((chapter) => !chapter.id || !chapter.title)
      )) {
        throw new Error("Chaque module doit avoir un identifiant et des chapitres avec identifiant et titre.");
      }
      const normalizedModules = modules.map((module) => ({
        ...module,
        resources: Array.isArray(module.resources) ? module.resources : [],
      }));
      if (new Set(normalizedModules.map((module) => module.id)).size !== normalizedModules.length) {
        throw new Error("Les identifiants des modules doivent être uniques.");
      }
      onSaveCourses(courses.map((course) => course.id === selectedCourseId ? { ...course, modules: normalizedModules, modulesCount: normalizedModules.length } : course));
    });
  }

  function saveQuizzes(event) {
    event.preventDefault();
    showSave(() => {
      const value = parseJson(quizzesJson, "Les quiz");
      if (!Array.isArray(value.courseQuiz) || !Array.isArray(value.moduleQuizzes)
        || value.courseQuiz.some((question) => !isValidQuestion(question))) {
        throw new Error("Le JSON doit contenir courseQuiz et moduleQuizzes sous forme de listes.");
      }
      const quizMap = new Map(value.moduleQuizzes.map((item) => [item.moduleId, item.quiz]));
      const course = courses.find((item) => item.id === selectedCourseId);
      const moduleIds = new Set((course?.modules || []).map((module) => module.id));
      if (!course || value.moduleQuizzes.some((item) =>
        !item.moduleId
        || !moduleIds.has(item.moduleId)
        || (item.quiz !== null && (!Array.isArray(item.quiz?.questions) || item.quiz.questions.some((question) => !isValidQuestion(question))))
      )) {
        throw new Error("Chaque quiz doit référencer un module et contenir une liste de questions au format valide.");
      }
      const modules = course.modules.map((module) => ({
        ...module,
        quiz: quizMap.has(module.id) ? quizMap.get(module.id) : module.quiz,
      }));
      onSaveCourses(courses.map((item) => item.id === selectedCourseId ? { ...item, quiz: value.courseQuiz, modules } : item));
    });
  }

  function addCategory(event) {
    event.preventDefault();
    const value = categoryDraft.trim();
    if (!value) return;
    if (getCategories().some((category) => category.toLocaleLowerCase("fr") === value.toLocaleLowerCase("fr"))) {
      setError("Cette catégorie existe déjà.");
      return;
    }
    showSave(() => {
      const next = [...customCategories, value];
      saveCustomCategories(next);
      setCustomCategories(next);
      setCategoryDraft("");
    });
  }

  function removeCategory(category) {
    if (courses.some((course) => course.category === category)) {
      setError("Cette catégorie est utilisée par une formation. Modifie d’abord la catégorie des formations concernées.");
      return;
    }
    showSave(() => {
      const next = customCategories.filter((item) => item !== category);
      saveCustomCategories(next);
      setCustomCategories(next);
    });
  }

  function saveUser(event) {
    event.preventDefault();
    showSave(() => {
      const updated = updateDemoStudentAccount(userForm);
      setStudentAccount(updated);
      setUserForm({ firstName: updated.firstName, lastName: updated.lastName, suspended: updated.suspended });
    });
  }

  function deleteUser() {
    if (!window.confirm("Supprimer le compte étudiant de démonstration de ce navigateur ?")) return;
    showSave(() => {
      deleteDemoStudentAccount();
      setStudentAccount(null);
      setUserForm({ firstName: "", lastName: "", suspended: false });
    });
  }

  const heading = {
    users: ["Gestion des utilisateurs", "Compte étudiant local de démonstration."],
    categories: ["Catégories", "Ajoute ou retire les catégories proposées dans le catalogue."],
    modules: ["Modules et chapitres", "Configure les modules et le contenu de chaque chapitre."],
    quizzes: ["Quiz et évaluations", "Configure les questions, réponses et seuils des quiz."],
    certificates: ["Certificats", "Configure l’activation et le texte du certificat étudiant."],
    settings: ["Paramètres du site", "Personnalise l’identité et les coordonnées de LearnSpace."],
    enrollments: ["Inscriptions", "État des inscriptions sur cette installation locale."],
    reports: ["Statistiques et rapports", "Progression et résultats présents dans ce navigateur."],
    notifications: ["Notifications", "État des fonctions de communication de la démo."],
    security: ["Sécurité", "Limites de la protection et paramètres disponibles localement."],
  }[section] || ["Administration", ""];

  return (
    <section className="admin-tools">
      <header className="admin-tools-heading">
        <div><span className="admin-eyebrow">CONFIGURATION</span><h2>{heading[0]}</h2><p>{heading[1]}</p></div>
      </header>
      {notice && <p className="admin-feedback is-success" role="status">{notice}</p>}
      {error && <p className="admin-feedback is-error" role="alert">{error}</p>}

      {section === "users" && (
        <article className="admin-tool-card">
          <h3>Compte étudiant sur cet appareil</h3>
          {studentAccount ? (
            <form className="admin-tool-form" onSubmit={saveUser}>
              <p className="admin-tool-muted">Adresse : <strong>{studentAccount.email}</strong> · Rôle : <strong>STUDENT</strong></p>
              <div className="admin-form-row">
                <label>Prénom<input value={userForm.firstName} onChange={(event) => setUserForm({ ...userForm, firstName: event.target.value })} required /></label>
                <label>Nom<input value={userForm.lastName} onChange={(event) => setUserForm({ ...userForm, lastName: event.target.value })} required /></label>
              </div>
              <label className="admin-checkbox"><input type="checkbox" checked={userForm.suspended} onChange={(event) => setUserForm({ ...userForm, suspended: event.target.checked })} /> Suspendre ce compte étudiant</label>
              <div className="admin-tool-actions"><button className="admin-save-button" type="submit">Enregistrer l’utilisateur</button><button className="admin-danger-button" type="button" onClick={deleteUser}>Supprimer ce compte local</button></div>
            </form>
          ) : <p className="admin-tool-muted">Aucun compte étudiant inscrit dans ce navigateur. Les comptes d’autres visiteurs ne sont pas accessibles sans backend.</p>}
        </article>
      )}

      {section === "categories" && (
        <article className="admin-tool-card">
          <form className="admin-inline-form" onSubmit={addCategory}><label>Nouvelle catégorie<input value={categoryDraft} onChange={(event) => setCategoryDraft(event.target.value)} maxLength={60} required /></label><button className="admin-save-button" type="submit">Ajouter</button></form>
          <div className="admin-category-list">{getCategories().map((category) => <div key={category}><span>{category}</span>{customCategories.includes(category) ? <button className="admin-danger-button" type="button" onClick={() => removeCategory(category)}>Retirer</button> : <small>Catégorie intégrée</small>}</div>)}</div>
          <p className="admin-tool-muted">Les catégories ajoutées sont disponibles dans l’accueil et les filtres du catalogue.</p>
        </article>
      )}

      {(section === "modules" || section === "quizzes") && (
        <article className="admin-tool-card">
          <label className="admin-course-select">Formation<select value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value)}>{courses.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}</select></label>
          {selectedCourse ? (
            <form className="admin-tool-form" onSubmit={section === "modules" ? saveModules : saveQuizzes}>
              <label>{section === "modules" ? "Modules et chapitres (JSON)" : "Quiz de formation et par module (JSON)"}
                <textarea className="admin-json-editor" value={section === "modules" ? modulesJson : quizzesJson} onChange={(event) => section === "modules" ? setModulesJson(event.target.value) : setQuizzesJson(event.target.value)} rows={22} spellCheck="false" />
              </label>
              <p className="admin-tool-muted">{section === "modules" ? "Conserve les identifiants de modules et de chapitres pour préserver les liens et la progression." : "Format requis : { \"courseQuiz\": [], \"moduleQuizzes\": [{ \"moduleId\": \"…\", \"quiz\": { \"title\": \"…\", \"passingScore\": 70, \"required\": false, \"questions\": [] } }] }. Une question utilise question, options et answer (index ou liste d’index)."}
              </p>
              <button className="admin-save-button" type="submit">Enregistrer {section === "modules" ? "les modules" : "les quiz"}</button>
            </form>
          ) : <p className="admin-tool-muted">Crée une formation pour configurer ses contenus.</p>}
        </article>
      )}

      {section === "certificates" && (
        <>
          <article className="admin-tool-card">
            <form className="admin-tool-form" onSubmit={(event) => {
              event.preventDefault();
              showSave(() => saveCertificateSettings(certificateSettings));
            }}>
              <label className="admin-checkbox"><input type="checkbox" checked={certificateSettings.enabled} onChange={(event) => setCertificateSettings({ ...certificateSettings, enabled: event.target.checked })} /> Autoriser la consultation des certificats étudiants</label>
              <div className="admin-form-row">
                <label>Titre du certificat<input value={certificateSettings.title} maxLength={80} onChange={(event) => setCertificateSettings({ ...certificateSettings, title: event.target.value })} required /></label>
                <label>Texte supérieur (kicker)<input value={certificateSettings.kicker} maxLength={100} onChange={(event) => setCertificateSettings({ ...certificateSettings, kicker: event.target.value })} required /></label>
              </div>
              <label>Texte de réussite<textarea rows={3} maxLength={500} value={certificateSettings.description} onChange={(event) => setCertificateSettings({ ...certificateSettings, description: event.target.value })} required /></label>
              <div className="admin-form-row">
                <label>Organisme émetteur<input value={certificateSettings.issuer} maxLength={80} onChange={(event) => setCertificateSettings({ ...certificateSettings, issuer: event.target.value })} required /></label>
                <label>Nom du programme / sous-titre<input value={certificateSettings.issuerTitle} maxLength={100} onChange={(event) => setCertificateSettings({ ...certificateSettings, issuerTitle: event.target.value })} required /></label>
              </div>
              <div className="admin-form-row">
                <label>Nom du signataire<input value={certificateSettings.signatureName} maxLength={80} onChange={(event) => setCertificateSettings({ ...certificateSettings, signatureName: event.target.value })} placeholder="Optionnel" /></label>
                <label>Fonction du signataire<input value={certificateSettings.signatureTitle} maxLength={100} onChange={(event) => setCertificateSettings({ ...certificateSettings, signatureTitle: event.target.value })} /></label>
              </div>
              <div className="admin-form-row">
                <label>Couleur du certificat<input type="color" value={certificateSettings.accentColor} onChange={(event) => setCertificateSettings({ ...certificateSettings, accentColor: event.target.value })} /></label>
                <label>URL du logo (optionnel)<input type="url" value={certificateSettings.logoUrl} onChange={(event) => setCertificateSettings({ ...certificateSettings, logoUrl: event.target.value })} placeholder="https://..." /></label>
              </div>
              <fieldset className="admin-certificate-rules">
                <legend>Conditions de délivrance</legend>
                <label className="admin-checkbox"><input type="checkbox" checked={certificateSettings.requireAllChapters} onChange={(event) => setCertificateSettings({ ...certificateSettings, requireAllChapters: event.target.checked })} /> Exiger que tous les chapitres soient terminés</label>
                <label className="admin-checkbox"><input type="checkbox" checked={certificateSettings.requireQuizPass} onChange={(event) => setCertificateSettings({ ...certificateSettings, requireQuizPass: event.target.checked })} /> Exiger la réussite des quiz configurés</label>
                <label>Score minimal de réussite (%)<input type="number" min="0" max="100" step="1" required value={certificateSettings.minimumQuizScore} disabled={!certificateSettings.requireQuizPass} onChange={(event) => setCertificateSettings({ ...certificateSettings, minimumQuizScore: Number(event.target.value) })} /></label>
                <p className="admin-tool-muted">Si l’option quiz est activée, l’étudiant doit réussir chaque quiz disponible. Le seuil appliqué est le plus élevé entre celui configuré ici et celui du quiz.</p>
              </fieldset>
              <button className="admin-save-button" type="submit">Enregistrer la configuration</button>
            </form>
            <p className="admin-tool-muted">Ces réglages sont appliqués à la page de certificat. Les certificats restent simulés localement, sans numéro vérifiable ni signature cryptographique.</p>
          </article>
          <article className="admin-tool-card">
            <h3>Aperçu du certificat</h3>
            <div className="admin-certificate-preview">
              <div className="certificate-paper" style={{ "--certificate-accent": certificateSettings.accentColor }}>
                <div className="certificate-border">
                  {certificateSettings.logoUrl ? <img className="admin-certificate-logo" src={certificateSettings.logoUrl} alt="Aperçu du logo" /> : <div className="certificate-mark">LS</div>}
                  <span className="certificate-kicker">{certificateSettings.issuer} · {certificateSettings.kicker}</span>
                  <h2>{certificateSettings.title || "Titre du certificat"}</h2>
                  <p className="certificate-intro">Ce certificat est décerné à</p>
                  <div className="certificate-name">Prénom Nom</div>
                  <p className="certificate-intro">pour avoir terminé avec succès la formation</p>
                  <h3>Nom de la formation</h3>
                  <p className="certificate-description">{certificateSettings.description}</p>
                  <div className="certificate-footer">
                    <span>{certificateSettings.issuer}<br />{certificateSettings.issuerTitle}</span>
                    <span className="certificate-seal">✓</span>
                  </div>
                  {certificateSettings.signatureName && <div className="admin-certificate-signature">{certificateSettings.signatureName}<small>{certificateSettings.signatureTitle}</small></div>}
                </div>
              </div>
            </div>
          </article>
        </>
      )}

      {section === "settings" && (
        <article className="admin-tool-card">
          <form className="admin-tool-form" onSubmit={(event) => {
            event.preventDefault();
            showSave(() => {
              saveSiteSettings(siteSettings);
              document.title = `${siteSettings.name} — Apprends, progresse, réussis`;
              document.documentElement.style.setProperty("--primary", siteSettings.accentColor);
            });
          }}>
            <label>Nom du site<input value={siteSettings.name} maxLength={60} onChange={(event) => setSiteSettings({ ...siteSettings, name: event.target.value })} required /></label>
            <label>Slogan<textarea rows={2} maxLength={150} value={siteSettings.tagline} onChange={(event) => setSiteSettings({ ...siteSettings, tagline: event.target.value })} /></label>
            <label>Email de contact<input type="email" value={siteSettings.supportEmail} onChange={(event) => setSiteSettings({ ...siteSettings, supportEmail: event.target.value })} required /></label>
            <label>Couleur d’accent<input type="color" value={siteSettings.accentColor} onChange={(event) => setSiteSettings({ ...siteSettings, accentColor: event.target.value })} /></label>
            <button className="admin-save-button" type="submit">Enregistrer les paramètres</button>
          </form>
        </article>
      )}

      {section === "reports" && (
        <article className="admin-tool-card">
          <div className="admin-report-stats"><div><strong>{courses.length}</strong><span>formations</span></div><div><strong>{enrollments.length}</strong><span>inscriptions locales</span></div><div><strong>{quizResults.length}</strong><span>résultats de quiz</span></div><div><strong>{downloads.length}</strong><span>téléchargements suivis</span></div></div>
          <h3>Progression stockée localement</h3>
          <div className="admin-report-list">{progressRows.map(({ course, completed, total }) => <div key={course.id}><span>{course.title}</span><strong>{completed}/{total} chapitres</strong></div>)}</div>
          <p className="admin-tool-muted">Ces chiffres proviennent uniquement de ce navigateur et ne représentent pas les utilisateurs de la plateforme.</p>
        </article>
      )}

      {section === "enrollments" && (
        <article className="admin-tool-card">
          <h3>Inscriptions observées dans ce navigateur</h3>
          {enrollments.length ? (
            <div className="admin-report-list">{enrollments.map((enrollment) => {
              const course = courses.find((item) => item.id === enrollment.courseId);
              return (
                <div key={`${enrollment.email}-${enrollment.courseId}`}>
                  <span>{enrollment.studentName || enrollment.email} · {course?.title || enrollment.courseId}</span>
                  <button className="admin-danger-button" type="button" onClick={() => showSave(() => { removeEnrollment(enrollment); setEnrollments(getEnrollments()); })}>Retirer</button>
                </div>
              );
            })}</div>
          ) : <p className="admin-tool-muted">Aucune inscription locale. L’ouverture d’une formation par un étudiant connecté crée une inscription de démonstration.</p>}
          <p className="admin-tool-muted">Cette liste n’inclut pas les autres navigateurs ni les utilisateurs distants.</p>
        </article>
      )}

      {(section === "notifications" || section === "security") && (
        <article className="admin-tool-card admin-capability-note">
          {section === "notifications" && <><h3>Notifications non distribuées</h3><p>Il n’existe pas de service d’envoi ni de boîte de réception centralisée. Les notifications ne peuvent pas être envoyées aux apprenants depuis cette démo.</p></>}
          {section === "security" && <><h3>Mode de sécurité local</h3><p>Les rôles, comptes et réglages enregistrés dans localStorage sont modifiables depuis le navigateur. Les routes React ne remplacent pas une autorisation serveur.</p><p>Avant une mise en production, configure une authentification backend, un contrôle des rôles côté API et une base de données partagée.</p></>}
        </article>
      )}
    </section>
  );
}

export default AdminTools;
