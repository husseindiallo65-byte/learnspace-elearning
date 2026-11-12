import { useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  Copy,
  Download,
  Eye,
  ImagePlus,
  Plus,
  Redo2,
  Save,
  ShieldCheck,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { getCertificateSettings, saveCertificateSettings } from "../../utils/adminSettings.js";
import { getCertificateEligibility } from "../../utils/certificateEligibility.js";
import { getIssuedCertificates, getCertificateTemplates, saveCertificateTemplates, setActiveCertificateTemplate, revokeIssuedCertificate } from "../../utils/certificateTemplates.js";
import CertificateCanvas from "../../components/Certificates/CertificateCanvas.jsx";
import "./CertificateStudio.css";

const variableOptions = [
  ["student_name", "Nom de l’étudiant"],
  ["course_name", "Nom de la formation"],
  ["completion_date", "Date de délivrance"],
  ["certificate_id", "Numéro du certificat"],
  ["institution_name", "Nom de l’institution"],
  ["instructor_name", "Nom du formateur"],
  ["duration", "Durée de la formation"],
  ["score", "Score obtenu"],
  ["signature_name", "Nom du signataire"],
  ["signature_title", "Fonction du signataire"],
];

const tabs = [
  ["templates", "Modèles"],
  ["editor", "Éditeur"],
  ["issued", "Certificats délivrés"],
  ["settings", "Délivrance"],
];

function makePreviewVariables(course, studentName, template) {
  const certificateSettings = getCertificateSettings();
  return {
    student_name: studentName,
    course_name: course?.title || "Formation de démonstration",
    completion_date: new Date().toLocaleDateString("fr-FR"),
    certificate_id: "LS-DEMO-2026-001",
    institution_name: certificateSettings.issuer || "LearnSpace",
    instructor_name: course?.instructor || "Formateur LearnSpace",
    duration: course?.duration || "6 heures",
    score: "92%",
    signature_name: certificateSettings.signatureName || "Direction LearnSpace",
    signature_title: certificateSettings.signatureTitle || "Direction pédagogique",
  };
}

function CertificateStudio({ courses }) {
  const [tab, setTab] = useState("templates");
  const [templates, setTemplates] = useState(getCertificateTemplates);
  const [selectedId, setSelectedId] = useState(() => {
    const active = localStorage.getItem("learnspace-active-certificate-template");
    const savedTemplates = getCertificateTemplates();
    return savedTemplates.some((template) => template.id === active) ? active : savedTemplates[0]?.id;
  });
  const [draft, setDraft] = useState(() => {
    const saved = getCertificateTemplates();
    const active = localStorage.getItem("learnspace-active-certificate-template");
    return structuredClone(saved.find((template) => template.id === active) || saved[0]);
  });
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [zoom, setZoom] = useState(100);
  const [testStudent, setTestStudent] = useState("Aïcha Diallo");
  const [testCourseId, setTestCourseId] = useState(courses[0]?.id || "");
  const [certificateSettings, setCertificateSettingsState] = useState(getCertificateSettings);
  const [records, setRecords] = useState(getIssuedCertificates);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [dragging, setDragging] = useState(null);
  const canvasRef = useRef(null);
  const bgFileRef = useRef(null);
  const imageFileRef = useRef(null);

  const selectedTemplate = templates.find((template) => template.id === selectedId) || templates[0];
  const selectedElement = draft?.elements.find((element) => element.id === selectedElementId);
  const testCourse = courses.find((course) => course.id === testCourseId);
  const variables = useMemo(
    () => draft ? makePreviewVariables(testCourse, testStudent, draft) : {},
    [draft, testCourse, testStudent],
  );
  const categories = ["Tous", ...new Set(templates.map((template) => template.category || "Personnalisé"))];
  const visibleTemplates = templates.filter((template) => categoryFilter === "Tous" || template.category === categoryFilter);
  const totalIssued = records.length;
  const pendingCount = courses.reduce((count, course) => count + (getCertificateEligibility(course, certificateSettings).eligible ? 0 : 1), 0);

  function report(action) {
    setNotice("");
    setError("");
    try {
      action();
      setNotice("Modifications enregistrées dans ce navigateur.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible d’enregistrer les modifications.");
    }
  }

  function updateDraft(patch, recordHistory = true) {
    if (!draft) return;
    if (recordHistory) {
      setHistory((previous) => [...previous.slice(-19), structuredClone(draft)]);
      setFuture([]);
    }
    setDraft((current) => ({ ...current, ...patch }));
  }

  function selectTemplate(template) {
    setSelectedId(template.id);
    setDraft(structuredClone(template));
    setSelectedElementId(null);
    setHistory([]);
    setFuture([]);
    setTab("editor");
  }

  function saveDraft() {
    report(() => {
      if (!draft.name.trim()) throw new Error("Donne un nom au modèle de certificat.");
      const current = templates.find((template) => template.id === draft.id);
      const next = templates.map((template) => template.id === draft.id ? {
        ...structuredClone(draft),
        updatedAt: new Date().toISOString(),
        versions: [...(current?.versions || []), { savedAt: new Date().toISOString(), snapshot: structuredClone(current || draft) }].slice(-5),
      } : template);
      saveCertificateTemplates(next);
      setTemplates(next);
    });
  }

  function publishDraft() {
    report(() => {
      const willPublish = !draft.published;
      const otherPublished = templates.find((template) => template.id !== draft.id && template.published);
      if (!willPublish && !otherPublished) throw new Error("Publie un autre modèle avant de dépublier le dernier modèle disponible.");
      const next = templates.map((template) => {
        if (template.id === draft.id) return { ...draft, published: willPublish, isDefault: willPublish ? draft.isDefault : false };
        if (!willPublish && !otherPublished.isDefault && template.id === otherPublished.id) return { ...template, isDefault: true };
        return template;
      });
      saveCertificateTemplates(next);
      if (willPublish) setActiveCertificateTemplate(draft.id);
      else if (draft.isDefault) setActiveCertificateTemplate(otherPublished.id);
      setTemplates(next);
      setDraft(structuredClone(next.find((template) => template.id === draft.id)));
      setNotice(willPublish ? "Modèle publié et sélectionné pour les prochains certificats." : "Modèle dépublié. Les nouveaux certificats utiliseront un autre modèle publié.");
    });
  }

  function useTemplate(template) {
    report(() => {
      if (!template.published) throw new Error("Publie d’abord ce modèle pour le rendre disponible aux étudiants.");
      const next = templates.map((item) => ({ ...item, isDefault: item.id === template.id }));
      saveCertificateTemplates(next);
      setActiveCertificateTemplate(template.id);
      setTemplates(next);
      setDraft(structuredClone(next.find((item) => item.id === template.id)));
      setSelectedId(template.id);
      setNotice("Ce modèle est maintenant le modèle par défaut des prochains certificats.");
    });
  }

  function duplicateTemplate(template) {
    const clone = structuredClone(template);
    const newId = `custom-${Date.now()}`;
    clone.id = newId;
    clone.name = `${template.name} — copie`;
    clone.category = "Personnalisé";
    clone.published = false;
    clone.isDefault = false;
    report(() => {
      const next = [...templates, clone];
      saveCertificateTemplates(next);
      setTemplates(next);
      selectTemplate(clone);
      setNotice("Copie créée. Personnalise-la puis enregistre-la.");
    });
  }

  function createTemplate() {
    const base = structuredClone(templates[0]);
    const id = `custom-${Date.now()}`;
    const template = {
      ...base,
      id,
      name: "Mon nouveau certificat",
      category: "Personnalisé",
      description: "Modèle personnalisé LearnSpace.",
      published: false,
      isDefault: false,
      frame: "minimal",
      elements: base.elements.map((element) => ({ ...element, id: `${id}-${element.id}` })),
    };
    report(() => {
      const next = [...templates, template];
      saveCertificateTemplates(next);
      setTemplates(next);
      selectTemplate(template);
      setNotice("Nouveau modèle créé. Modifie-le dans l’éditeur.");
    });
  }

  function deleteTemplate(template) {
    if (template.isDefault) {
      setError("Choisis un autre modèle par défaut avant de supprimer celui-ci.");
      return;
    }
    if (!window.confirm(`Supprimer le modèle « ${template.name} » ?`)) return;
    report(() => {
      const next = templates.filter((item) => item.id !== template.id);
      saveCertificateTemplates(next);
      setTemplates(next);
      if (selectedId === template.id) {
        setSelectedId(next[0]?.id);
        setDraft(next[0] ? structuredClone(next[0]) : null);
      }
    });
  }

  function updateElement(elementId, patch, recordHistory = true) {
    const nextElements = draft.elements.map((element) => element.id === elementId ? { ...element, ...patch } : element);
    updateDraft({ elements: nextElements }, recordHistory);
  }

  function addElement(type, content, width = 25, height = 8) {
    const id = `element-${Date.now()}`;
    const element = {
      id,
      type,
      content,
      x: 37.5,
      y: 45,
      w: width,
      h: height,
      size: 2,
      color: draft.accent,
      align: "center",
      weight: type === "text" ? 600 : 400,
      font: "Arial",
      opacity: 1,
      rotation: 0,
    };
    updateDraft({ elements: [...draft.elements, element] });
    setSelectedElementId(id);
  }

  function duplicateElement() {
    if (!selectedElement) return;
    const element = { ...selectedElement, id: `element-${Date.now()}`, x: Math.min(95 - selectedElement.w, selectedElement.x + 3), y: Math.min(95 - selectedElement.h, selectedElement.y + 3) };
    updateDraft({ elements: [...draft.elements, element] });
    setSelectedElementId(element.id);
  }

  function deleteElement() {
    if (!selectedElement) return;
    updateDraft({ elements: draft.elements.filter((element) => element.id !== selectedElement.id) });
    setSelectedElementId(null);
  }

  function undo() {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setFuture((current) => [structuredClone(draft), ...current.slice(0, 19)]);
    setHistory((current) => current.slice(0, -1));
    setDraft(structuredClone(previous));
  }

  function redo() {
    if (!future.length) return;
    const next = future[0];
    setHistory((current) => [...current.slice(-19), structuredClone(draft)]);
    setFuture((current) => current.slice(1));
    setDraft(structuredClone(next));
  }

  function startDrag(event, element) {
    if (event.button !== 0 || !canvasRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedElementId(element.id);
    setDragging({
      elementId: element.id,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startX: element.x,
      startY: element.y,
      width: canvasRef.current.clientWidth,
      height: canvasRef.current.clientHeight,
      initialDraft: structuredClone(draft),
    });
  }

  function dragElement(event) {
    if (!dragging || event.pointerId !== dragging.pointerId) return;
    const x = Math.max(0, Math.min(100, dragging.startX + ((event.clientX - dragging.originX) / dragging.width) * 100));
    const y = Math.max(0, Math.min(100, dragging.startY + ((event.clientY - dragging.originY) / dragging.height) * 100));
    setDraft((current) => ({
      ...current,
      elements: current.elements.map((element) => element.id === dragging.elementId ? { ...element, x, y } : element),
    }));
  }

  function endDrag(event) {
    if (!dragging || event.pointerId !== dragging.pointerId) return;
    setHistory((previous) => [...previous.slice(-19), dragging.initialDraft]);
    setFuture([]);
    setDragging(null);
  }

  function readImageFile(event, callback) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisis un fichier image valide.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("L’image doit faire moins de 2 Mo pour rester dans le stockage local.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => callback(String(reader.result));
    reader.onerror = () => setError("Impossible de lire ce fichier image.");
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function printPreview() {
    const orientationClass = `print-certificate-preview-${previewTemplate.format === "portrait" ? "portrait" : "landscape"}`;
    document.body.classList.add("print-certificate-preview", orientationClass);
    window.print();
    window.setTimeout(() => document.body.classList.remove("print-certificate-preview", orientationClass), 1000);
  }

  function saveIssuanceSettings(event) {
    event.preventDefault();
    report(() => saveCertificateSettings(certificateSettings));
  }

  function revoke(certificateId) {
    if (!window.confirm("Révoquer ce certificat local ? Cette action est visible dans ce navigateur uniquement.")) return;
    report(() => {
      revokeIssuedCertificate(certificateId);
      setRecords(getIssuedCertificates());
    });
  }

  const previewTemplate = draft || selectedTemplate;
  if (!previewTemplate) return null;

  return (
    <section className="certificate-studio">
      <header className="certificate-studio-heading">
        <div><span className="admin-eyebrow">CERTIFICATS · STUDIO DE CRÉATION</span><h2>Créez des certificats à votre image</h2><p>Modèles réutilisables, éditeur visuel et aperçu en direct.</p></div>
        <button type="button" className="admin-create-button" onClick={createTemplate}><Plus size={16} /> Créer un certificat</button>
      </header>

      <div className="certificate-studio-stats">
        <article><strong>{templates.length}</strong><span>Modèles disponibles</span></article>
        <article><strong>{templates.filter((template) => template.category === "Personnalisé").length}</strong><span>Modèles personnalisés</span></article>
        <article><strong>{totalIssued}</strong><span>Certificats générés localement</span></article>
        <article><strong>{pendingCount}</strong><span>Formations sans validation</span></article>
      </div>
      <aside className="admin-demo-notice" role="note">
        <ShieldCheck size={18} />
        <p><strong>Stockage local de démonstration.</strong> Les modèles et certificats sont enregistrés dans ce navigateur. L’export utilise l’impression PDF du navigateur; une vérification globale et sécurisée nécessite un backend.</p>
      </aside>

      <nav className="certificate-studio-tabs" aria-label="Outils de certificats">
        {tabs.map(([id, label]) => <button type="button" className={tab === id ? "is-active" : ""} onClick={() => { setTab(id); setNotice(""); setError(""); }} key={id}>{label}</button>)}
      </nav>
      {notice && <p className="admin-feedback is-success" role="status">{notice}</p>}
      {error && <p className="admin-feedback is-error" role="alert">{error}</p>}

      {tab === "templates" && (
        <div className="certificate-template-library">
          <div className="certificate-library-toolbar">
            <label>Catégorie<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <button type="button" className="admin-create-button" onClick={createTemplate}><Plus size={16} /> Ajouter un modèle</button>
          </div>
          <div className="certificate-template-grid">
            {visibleTemplates.map((template) => (
              <article className={`certificate-template-card ${selectedId === template.id ? "is-selected" : ""}`} key={template.id}>
                <button type="button" className="certificate-template-thumb" onClick={() => selectTemplate(template)} aria-label={`Prévisualiser ${template.name}`}>
                  <CertificateCanvas template={template} variables={makePreviewVariables(courses[0], "Aïcha Diallo", template)} preview />
                </button>
                <div className="certificate-template-info">
                  <div><span>{template.category}</span><h3>{template.name}</h3><p>{template.description}</p></div>
                  <div className="certificate-template-badges">{template.isDefault && <span>Par défaut</span>}{template.published ? <span className="is-live">Publié</span> : <span className="is-draft">Brouillon</span>}</div>
                </div>
                <div className="certificate-template-actions">
                  <button type="button" onClick={() => selectTemplate(template)}><Eye size={14} /> Prévisualiser / Modifier</button>
                  <button type="button" onClick={() => useTemplate(template)} aria-label={`Utiliser ${template.name}`}><Check size={14} /></button>
                  <button type="button" onClick={() => duplicateTemplate(template)} aria-label={`Dupliquer ${template.name}`}><Copy size={14} /></button>
                  <button type="button" onClick={() => deleteTemplate(template)} aria-label={`Supprimer ${template.name}`}><Trash2 size={14} /></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === "editor" && (
        <div className="certificate-editor">
          <aside className="certificate-editor-panel certificate-editor-left">
            <h3>Éléments</h3>
            <div className="certificate-editor-actions">
              <button type="button" onClick={() => addElement("text", "Nouveau texte")}><Plus size={14} /> Ajouter un texte</button>
              <button type="button" onClick={() => addElement("image", "", 16, 13)}><ImagePlus size={14} /> Ajouter un logo / image</button>
              <button type="button" onClick={() => addElement("shape", "", 9, 9)}><Plus size={14} /> Ajouter un sceau</button>
              <button type="button" onClick={() => addElement("text", "{{signature_name}}\n{{signature_title}}", 23, 10)}><Plus size={14} /> Ajouter une signature</button>
            </div>
            <h4>Variables dynamiques</h4>
            <p className="certificate-helper">Choisis un champ pour l’ajouter sur le certificat.</p>
            <div className="certificate-variable-list">{variableOptions.map(([key, label]) => <button type="button" key={key} onClick={() => addElement("text", `{{${key}}}`, 36, 7)}><span>{label}</span><code>{`{{${key}}}`}</code></button>)}</div>
            <div className="certificate-layer-list">
              <h4>Calques</h4>
              {draft.elements.map((element, index) => <button type="button" className={selectedElementId === element.id ? "is-active" : ""} onClick={() => setSelectedElementId(element.id)} key={element.id}><span>{index + 1}. {element.type === "image" ? "Image" : element.type === "shape" ? "Forme" : element.content.slice(0, 25)}</span></button>)}
            </div>
          </aside>

          <div className="certificate-editor-workspace">
            <div className="certificate-editor-toolbar">
              <label>Modèle<select value={draft.id} onChange={(event) => selectTemplate(templates.find((template) => template.id === event.target.value))}>{templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}</select></label>
              <button type="button" onClick={undo} disabled={!history.length} title="Annuler"><Undo2 size={16} /></button>
              <button type="button" onClick={redo} disabled={!future.length} title="Rétablir"><Redo2 size={16} /></button>
              <button type="button" onClick={() => setZoom(Math.max(60, zoom - 10))} title="Dézoomer"><ZoomOut size={16} /></button><span>{zoom}%</span><button type="button" onClick={() => setZoom(Math.min(130, zoom + 10))} title="Zoomer"><ZoomIn size={16} /></button>
              <button type="button" onClick={printPreview}><Download size={15} /> Exporter PDF</button>
            </div>
            <div className="certificate-editor-canvas-scroll">
              <div className="certificate-editor-canvas-scale" style={{ width: `${zoom}%` }}>
                <CertificateCanvas
                  template={draft}
                  variables={makePreviewVariables(testCourse, testStudent, draft)}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                  onElementPointerDown={startDrag}
                  onPointerMove={dragElement}
                  onPointerUp={endDrag}
                  canvasRef={canvasRef}
                />
              </div>
            </div>
            <div className="certificate-preview-fields">
              <label>Étudiant test<input value={testStudent} onChange={(event) => setTestStudent(event.target.value)} /></label>
              <label>Formation test<select value={testCourseId} onChange={(event) => setTestCourseId(event.target.value)}>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
            </div>
          </div>

          <aside className="certificate-editor-panel certificate-editor-right">
            <h3>Propriétés du modèle</h3>
            <label>Nom du modèle<input value={draft.name} onChange={(event) => updateDraft({ name: event.target.value }, false)} /></label>
            <label>Catégorie<select value={draft.category} onChange={(event) => updateDraft({ category: event.target.value })}>{["Moderne", "Académique", "Professionnel", "Premium", "Personnalisé"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Format<select value={draft.format} onChange={(event) => updateDraft({ format: event.target.value })}><option value="landscape">A4 paysage</option><option value="portrait">A4 portrait</option><option value="custom">Format personnalisé</option></select></label>
            {draft.format === "custom" && <div className="certificate-dimensions"><label>Largeur (mm)<input type="number" min="80" max="500" value={draft.customWidth || 297} onChange={(event) => updateDraft({ customWidth: Number(event.target.value) })} /></label><label>Hauteur (mm)<input type="number" min="80" max="500" value={draft.customHeight || 210} onChange={(event) => updateDraft({ customHeight: Number(event.target.value) })} /></label></div>}
            <label>Arrière-plan<input type="color" value={draft.background?.startsWith("#") ? draft.background : "#ffffff"} onChange={(event) => updateDraft({ background: event.target.value, gradient: "", backgroundImage: "" })} /></label>
            <label>Dégradé CSS<input value={draft.gradient || ""} onChange={(event) => updateDraft({ gradient: event.target.value, backgroundImage: "" })} placeholder="linear-gradient(120deg, #fff, #e8f5ed)" /></label>
            <button type="button" className="certificate-upload-button" onClick={() => bgFileRef.current?.click()}><ImagePlus size={14} /> Importer un fond image</button>
            <input ref={bgFileRef} type="file" accept="image/*" hidden onChange={(event) => readImageFile(event, (backgroundImage) => updateDraft({ backgroundImage, gradient: "" }))} />
            {selectedElement ? (
              <div className="certificate-properties">
                <h3>Élément sélectionné</h3>
                {selectedElement.type === "text" && <label>Texte / variable<textarea rows={3} value={selectedElement.content} onChange={(event) => updateElement(selectedElement.id, { content: event.target.value }, false)} /></label>}
                <div className="certificate-dimensions">
                  <label>X (%)<input type="number" min="0" max="100" step="0.5" value={Number(selectedElement.x.toFixed(1))} onChange={(event) => updateElement(selectedElement.id, { x: Number(event.target.value) }, false)} /></label>
                  <label>Y (%)<input type="number" min="0" max="100" step="0.5" value={Number(selectedElement.y.toFixed(1))} onChange={(event) => updateElement(selectedElement.id, { y: Number(event.target.value) }, false)} /></label>
                  <label>Largeur (%)<input type="number" min="2" max="100" step="0.5" value={Number(selectedElement.w.toFixed(1))} onChange={(event) => updateElement(selectedElement.id, { w: Number(event.target.value) }, false)} /></label>
                  <label>Hauteur (%)<input type="number" min="2" max="100" step="0.5" value={Number(selectedElement.h.toFixed(1))} onChange={(event) => updateElement(selectedElement.id, { h: Number(event.target.value) }, false)} /></label>
                </div>
                {selectedElement.type === "text" && <>
                  <label>Taille de texte<input type="number" min="0.8" max="8" step="0.1" value={selectedElement.size} onChange={(event) => updateElement(selectedElement.id, { size: Number(event.target.value) }, false)} /></label>
                  <label>Couleur<input type="color" value={selectedElement.color || "#253345"} onChange={(event) => updateElement(selectedElement.id, { color: event.target.value }, false)} /></label>
                  <label>Police<select value={selectedElement.font || "Arial"} onChange={(event) => updateElement(selectedElement.id, { font: event.target.value }, false)}>{["Arial", "Georgia", "Times New Roman", "Verdana", "Trebuchet MS"].map((font) => <option key={font}>{font}</option>)}</select></label>
                  <div className="certificate-align-actions"><button type="button" onClick={() => updateElement(selectedElement.id, { align: "left" }, false)}><AlignLeft size={15} /></button><button type="button" onClick={() => updateElement(selectedElement.id, { align: "center" }, false)}><AlignCenter size={15} /></button><button type="button" onClick={() => updateElement(selectedElement.id, { align: "right" }, false)}><AlignRight size={15} /></button><button type="button" onClick={() => updateElement(selectedElement.id, { weight: selectedElement.weight >= 700 ? 400 : 700 }, false)}>G</button></div>
                </>}
                {selectedElement.type === "image" && <>
                  <button type="button" className="certificate-upload-button" onClick={() => imageFileRef.current?.click()}><ImagePlus size={14} /> Importer une image / signature</button>
                  <input ref={imageFileRef} type="file" accept="image/*" hidden onChange={(event) => readImageFile(event, (content) => updateElement(selectedElement.id, { content }))} />
                </>}
                <label>Opacité<input type="range" min="0.1" max="1" step="0.05" value={selectedElement.opacity ?? 1} onChange={(event) => updateElement(selectedElement.id, { opacity: Number(event.target.value) }, false)} /></label>
                <label>Rotation (°)<input type="number" min="-180" max="180" value={selectedElement.rotation || 0} onChange={(event) => updateElement(selectedElement.id, { rotation: Number(event.target.value) }, false)} /></label>
                <div className="certificate-align-actions"><button type="button" onClick={duplicateElement}><Copy size={14} /> Dupliquer</button><button type="button" onClick={deleteElement}><Trash2 size={14} /> Supprimer</button></div>
              </div>
            ) : <p className="certificate-helper">Sélectionne un élément dans le certificat pour modifier sa position et ses propriétés.</p>}
            <div className="certificate-editor-actions">
              <button type="button" onClick={saveDraft}><Save size={14} /> Enregistrer le modèle</button>
              <button type="button" onClick={publishDraft}><Check size={14} /> {draft.published ? "Dépublier le modèle" : "Publier et utiliser"}</button>
              {selectedTemplate?.id === draft.id && draft.isDefault && <span className="certificate-default-label"><Check size={13} /> Modèle par défaut</span>}
            </div>
          </aside>
        </div>
      )}

      {tab === "issued" && (
        <article className="admin-tool-card">
          <h3>Certificats de démonstration délivrés</h3>
          {records.length ? <div className="certificate-issued-list">{records.map((record) => <div key={record.id}><span><strong>{record.studentName}</strong><small>{record.courseName} · {new Date(record.completionDate).toLocaleDateString("fr-FR")} · {record.id}</small></span><span className={`certificate-record-status ${record.status}`}>{record.status === "valid" ? "Valide" : "Révoqué"}</span><div>{record.status === "valid" && <button className="admin-danger-button" type="button" onClick={() => revoke(record.id)}><ShieldCheck size={14} /> Révoquer</button>}<a href={`/verify-certificate/${encodeURIComponent(record.id)}`} target="_blank" rel="noreferrer">Vérifier</a></div></div>)}</div> : <p className="admin-tool-muted">Aucun certificat n’a encore été délivré depuis ce navigateur. Le certificat est créé quand un étudiant valide les conditions et consulte son certificat.</p>}
        </article>
      )}

      {tab === "settings" && (
        <article className="admin-tool-card">
          <form className="admin-tool-form" onSubmit={saveIssuanceSettings}>
            <label className="admin-checkbox"><input type="checkbox" checked={certificateSettings.enabled} onChange={(event) => setCertificateSettingsState({ ...certificateSettings, enabled: event.target.checked })} /> Autoriser l’accès aux certificats étudiants</label>
            <label className="admin-checkbox"><input type="checkbox" checked={certificateSettings.requireAllChapters} onChange={(event) => setCertificateSettingsState({ ...certificateSettings, requireAllChapters: event.target.checked })} /> Exiger tous les chapitres terminés</label>
            <label className="admin-checkbox"><input type="checkbox" checked={certificateSettings.requireQuizPass} onChange={(event) => setCertificateSettingsState({ ...certificateSettings, requireQuizPass: event.target.checked })} /> Exiger la réussite de chaque quiz configuré</label>
            <label>Score minimal (%)<input type="number" min="0" max="100" step="1" disabled={!certificateSettings.requireQuizPass} value={certificateSettings.minimumQuizScore} onChange={(event) => setCertificateSettingsState({ ...certificateSettings, minimumQuizScore: Number(event.target.value) })} /></label>
            <label>Nom affiché de l’institution<input value={certificateSettings.issuer} onChange={(event) => setCertificateSettingsState({ ...certificateSettings, issuer: event.target.value })} /></label>
            <label>Texte par défaut de réussite<textarea rows={3} value={certificateSettings.description} onChange={(event) => setCertificateSettingsState({ ...certificateSettings, description: event.target.value })} /></label>
            <button className="admin-save-button" type="submit">Enregistrer les paramètres de délivrance</button>
          </form>
          <p className="admin-tool-muted">Les certificats ne sont émis qu’aux étudiants qui remplissent les conditions. La révocation et la vérification sont locales; elles ne sont pas cryptographiquement vérifiables.</p>
        </article>
      )}

      <div className={`certificate-hidden-print ${previewTemplate.format === "portrait" ? "is-portrait" : ""}`}>
        <CertificateCanvas template={previewTemplate} variables={variables} preview />
      </div>
    </section>
  );
}

export default CertificateStudio;
