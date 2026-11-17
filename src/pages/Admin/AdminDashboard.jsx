import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Brain,
  ChartNoAxesCombined,
  Check,
  ClipboardList,
  ChevronRight,
  CirclePlay,
  Eye,
  EyeOff,
  Globe,
  GraduationCap,
  House,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Palette,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Settings,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { getCatalogCourses, saveCatalogCourses } from "../../data/courses.js";
import { logoutDemoAccount } from "../../utils/demoAuth.js";
import AdminTools from "./AdminTools.jsx";
import "./AdminDashboard.css";

const emptyForm = {
  title: "",
  category: "",
  instructor: "",
  duration: "",
  level: "Débutant",
  shortDescription: "",
  description: "",
  image: "",
};

function createCourseId(title, existingCourses) {
  const baseId = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "formation";
  let id = baseId;
  let suffix = 2;
  while (existingCourses.some((course) => course.id === id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }
  return id;
}

function createModule(courseId, title, description) {
  const moduleId = `${courseId}-module-1`;
  return {
    id: moduleId,
    title: "Module 1 — Introduction",
    order: 1,
    duration: "",
    resources: [],
    quiz: {
      id: `${moduleId}-quiz`,
      title: "Quiz — Introduction",
      passingScore: 70,
      required: false,
      questions: [],
    },
    chapters: [{
      id: `${courseId}-introduction`,
      title: "Introduction",
      content: description || title,
      videoUrl: "",
      videoEmbedUrl: "",
    }],
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allCourses, setAllCourses] = useState(() => getCatalogCourses({ includeUnpublished: true }));
  const activeSection = location.pathname.replace(/^\/admin\/?/, "") || "overview";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [imageInputMode, setImageInputMode] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");
    if (!query) return allCourses;
    return allCourses.filter((course) =>
      `${course.title} ${course.category} ${course.instructor}`.toLocaleLowerCase("fr").includes(query),
    );
  }, [allCourses, search]);

  const publishedCount = allCourses.filter((course) => course.isPublished !== false).length;
  const draftCount = allCourses.length - publishedCount;
  const moduleCount = allCourses.reduce((total, course) => total + (course.modules?.length || 0), 0);
  const navigationSections = [
    { id: "overview", label: "Vue d’ensemble", icon: LayoutDashboard },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "formations", label: "Formations", icon: BookOpen },
    { id: "categories", label: "Catégories", icon: Layers3 },
    { id: "courses", label: "Cours vidéo et PDF", icon: CirclePlay },
    { id: "modules", label: "Modules et chapitres", icon: ClipboardList },
    { id: "quizzes", label: "Quiz", icon: Brain },
    { id: "certificates", label: "Certificats", icon: Check },
    { id: "settings", label: "Paramètres du site", icon: Settings },
    { id: "enrollments", label: "Inscriptions", icon: GraduationCap },
    { id: "reports", label: "Statistiques", icon: ChartNoAxesCombined },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: ShieldAlert },
  ];
  const sectionTitles = Object.fromEntries(navigationSections.map(({ id, label }) => [id, label]));

  function persistCourses(nextCourses) {
    saveCatalogCourses(nextCourses);
    setAllCourses(nextCourses);
  }

  function beginCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setImageInputMode(null);
    setImageFile(null);
    setImagePreview("");
    setError("");
    setNotice("");
  }

  function beginEdit(course) {
    setEditingId(course.id);
    const isDataUrl = course.image?.startsWith("data:");
    setForm({
      title: course.title || "",
      category: course.category || "",
      instructor: course.instructor || "",
      duration: course.duration || "",
      level: course.level || "Débutant",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      image: course.image || "",
    });
    setImageInputMode(isDataUrl ? "file" : "url");
    setImagePreview(isDataUrl ? course.image : "");
    setImageFile(null);
    setError("");
    setNotice("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const existing = editingId ? allCourses.find((course) => course.id === editingId) : null;
    const id = existing?.id || createCourseId(form.title, allCourses);
    const updatedCourse = {
      ...(existing || {
        id,
        color: "green",
        icon: "📘",
        modulesCount: 1,
        students: 0,
        rating: "Nouveau",
        objectives: [],
        quiz: [],
        modules: [createModule(id, form.title, form.description)],
      }),
      ...form,
      image: imageInputMode === "file" ? imagePreview : form.image.trim(),
      isPublished: existing?.isPublished ?? false,
    };
    const nextCourses = existing
      ? allCourses.map((course) => course.id === editingId ? updatedCourse : course)
      : [updatedCourse, ...allCourses];

    try {
      persistCourses(nextCourses);
      setEditingId(updatedCourse.id);
      setForm({
        title: updatedCourse.title,
        category: updatedCourse.category,
        instructor: updatedCourse.instructor,
        duration: updatedCourse.duration,
        level: updatedCourse.level,
        shortDescription: updatedCourse.shortDescription,
        description: updatedCourse.description,
        image: updatedCourse.image,
      });
      setImageInputMode(updatedCourse.image?.startsWith("data:") ? "file" : "url");
      setImagePreview(updatedCourse.image?.startsWith("data:") ? updatedCourse.image : "");
      setNotice(existing ? "Formation mise à jour dans ce navigateur." : "Brouillon créé dans ce navigateur.");
    } catch {
      setError("Impossible d’enregistrer la formation dans le stockage local de ce navigateur.");
    }
  }

  function togglePublished(course) {
    const nextCourses = allCourses.map((item) =>
      item.id === course.id ? { ...item, isPublished: item.isPublished === false } : item,
    );
    try {
      persistCourses(nextCourses);
      setNotice(course.isPublished === false ? "Formation publiée dans ce navigateur." : "Formation dépubliée.");
      setError("");
    } catch {
      setError("Impossible de modifier le statut de publication dans ce navigateur.");
      setNotice("");
    }
  }

  function deleteCourse(course) {
    if (!window.confirm(`Supprimer « ${course.title} » de ce catalogue local ?`)) return;
    try {
      persistCourses(allCourses.filter((item) => item.id !== course.id));
      if (editingId === course.id) beginCreate();
      setNotice("Formation supprimée du catalogue local.");
      setError("");
    } catch {
      setError("Impossible de supprimer cette formation du stockage local.");
      setNotice("");
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleImageModeChange(mode) {
    setImageInputMode(mode);
    if (mode === "url") {
      setImageFile(null);
      setImagePreview("");
    }
  }

  function handleImageFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Seuls les formats PNG, JPG, JPEG et WEBP sont acceptés.");
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("L’image ne doit pas dépasser 5 Mo.");
      return;
    }
    setError("");
    setImageFile(file);
    setImageInputMode("file");
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview("");
    setImageInputMode(null);
    setForm((current) => ({ ...current, image: "" }));
  }

  return (
    <main className="admin-dashboard">
      {sidebarOpen && <button className="admin-sidebar-overlay" type="button" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu" />}
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <Link className="admin-sidebar-brand" to="/">
          <GraduationCap size={28} />
          <span>LearnSpace<small>ADMIN DÉMO</small></span>
        </Link>
        <nav className="admin-sidebar-nav" aria-label="Navigation administrateur">
          <span className="admin-nav-label">GESTION DE LA PLATEFORME</span>
          {navigationSections.map(({ id, label, icon: Icon }) => (
            <Link
              className={`admin-nav-link ${activeSection === id ? "is-active" : ""}`}
              to={id === "overview" ? "/admin" : `/admin/${id}`}
              onClick={() => setSidebarOpen(false)}
              key={id}
            >
              <Icon size={17} /><span>{label}</span>
            </Link>
          ))}

          <span className="admin-nav-label">ACCÈS AU SITE</span>
          <Link className="admin-nav-link" to="/"><House size={17} /><span>Accueil</span><ChevronRight size={14} /></Link>
          <Link className="admin-nav-link" to="/formations"><GraduationCap size={17} /><span>Catalogue public</span><ChevronRight size={14} /></Link>
        </nav>
        <button type="button" className="admin-logout-link" onClick={() => { logoutDemoAccount(); navigate("/connexion"); }}>
          <LogOut size={17} /><span>Se déconnecter</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="admin-mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Ouvrir la navigation">
            <Menu size={20} />
          </button>
          <span className="admin-topbar-title">Espace administrateur</span>
          <Link className="admin-back-link" to="/"><ArrowLeft size={17} /> Retour au site</Link>
        </header>

      <div className="admin-content">
        <section className="admin-heading">
          <div>
            <span className="admin-eyebrow">ESPACE ADMINISTRATEUR · DÉMONSTRATION</span>
            <h1>{sectionTitles[activeSection] || "Administration"}</h1>
            <p>{activeSection === "overview" ? "Accède aux outils de configuration et de gestion de la plateforme." : `Configure la section « ${sectionTitles[activeSection] || "Administration"} » dans ce navigateur.`}</p>
          </div>
          {activeSection === "overview" ? (
            <button type="button" className="admin-create-button" onClick={() => navigate("/admin/formations")}>
              <BookOpen size={17} /> Gérer les formations
            </button>
          ) : activeSection === "formations" ? (
            <button type="button" className="admin-create-button" onClick={beginCreate}>
              <Plus size={17} /> Nouvelle formation
            </button>
          ) : null}
        </section>

        <aside className="admin-demo-notice" role="note">
          <ShieldAlert size={19} />
          <p>
            <strong>Mode démonstration local.</strong> Les réglages et contenus modifiables sont enregistrés uniquement dans ce navigateur.
            Les fonctions multi-utilisateurs, inscriptions partagées, notifications et autorisations de production nécessitent un backend.
          </p>
        </aside>

        <section className="admin-stats" aria-label="Statistiques du catalogue">
          <article><span className="admin-stat-icon"><BookOpen size={19} /></span><div><strong>{allCourses.length}</strong><span>Formations au catalogue</span></div></article>
          <article><span className="admin-stat-icon is-published"><Check size={19} /></span><div><strong>{publishedCount}</strong><span>Publiées</span></div></article>
          <article><span className="admin-stat-icon is-draft"><EyeOff size={19} /></span><div><strong>{draftCount}</strong><span>Brouillons</span></div></article>
          <article><span className="admin-stat-icon is-modules"><Layers3 size={19} /></span><div><strong>{moduleCount}</strong><span>Modules</span></div></article>
        </section>

        {activeSection === "overview" ? (
          <section className="admin-overview">
            <div className="admin-overview-card">
              <span className="admin-stat-icon is-published"><Check size={19} /></span>
              <div><h2>Catalogue des formations</h2><p>Crée, modifie et publie le contenu pédagogique disponible dans cette démonstration.</p></div>
              <button type="button" onClick={() => navigate("/admin/formations")}>Ouvrir la gestion <ChevronRight size={15} /></button>
            </div>
            <div className="admin-overview-card">
              <span className="admin-stat-icon is-modules"><CirclePlay size={19} /></span>
              <div><h2>Accès aux formations</h2><p>Ouvre un cours publié pour vérifier son expérience côté apprenant.</p></div>
              <Link to="/formations">Voir le catalogue <ChevronRight size={15} /></Link>
            </div>
            <div className="admin-quick-access">
              <h2>Accès rapides</h2>
              <div>
                <Link to="/admin/users"><Users size={17} /> Gérer les utilisateurs</Link>
                <Link to="/admin/categories"><Palette size={17} /> Gérer les catégories</Link>
                <Link to="/admin/modules"><ClipboardList size={17} /> Contenus et modules</Link>
                <Link to="/admin/quizzes"><Brain size={17} /> Configurer les quiz</Link>
                <Link to="/admin/settings"><Settings size={17} /> Paramètres du site</Link>
                <Link to="/admin/reports"><ChartNoAxesCombined size={17} /> Voir les statistiques</Link>
              </div>
            </div>
          </section>
        ) : activeSection === "formations" ? (
        <div className="admin-workspace">
          <section className="admin-catalog">
            <div className="admin-section-heading">
              <div><h2>Catalogue</h2><p>{filteredCourses.length} formation(s)</p></div>
              <label className="admin-search">
                <Search size={16} aria-hidden="true" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher..." aria-label="Rechercher une formation" />
              </label>
            </div>

            {notice && <p className="admin-feedback is-success" role="status">{notice}</p>}
            {error && <p className="admin-feedback is-error" role="alert">{error}</p>}

            {filteredCourses.length ? (
              <div className="admin-course-list">
                {filteredCourses.map((course) => (
                  <article className={`admin-course-row ${editingId === course.id ? "is-selected" : ""}`} key={course.id}>
                    <span className="admin-course-cover">
                      {course.image ? <img src={course.image} alt="" /> : <span>{course.icon || "📘"}</span>}
                    </span>
                    <div className="admin-course-copy">
                      <strong>{course.title}</strong>
                      <span>{course.category} · {course.instructor}</span>
                      <small>{course.modules?.length || 0} modules · {course.duration}</small>
                    </div>
                    <span className={`admin-publish-status ${course.isPublished === false ? "is-draft" : "is-published"}`}>
                      {course.isPublished === false ? "Brouillon" : "Publiée"}
                    </span>
                    <div className="admin-course-actions">
                      <button type="button" onClick={() => togglePublished(course)} aria-label={course.isPublished === false ? `Publier ${course.title}` : `Dépublier ${course.title}`}>
                        {course.isPublished === false ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button type="button" onClick={() => beginEdit(course)} aria-label={`Modifier ${course.title}`}><Pencil size={16} /></button>
                      <button type="button" onClick={() => deleteCourse(course)} aria-label={`Supprimer ${course.title}`}><Trash2 size={16} /></button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="admin-empty"><Users size={22} /><strong>Aucune formation trouvée</strong><span>Modifie la recherche ou crée une formation.</span></div>
            )}
          </section>

          <section className="admin-editor">
            <header className="admin-editor-heading">
              <div><span className="admin-eyebrow">{editingId ? "MODIFICATION" : "NOUVEAU CONTENU"}</span><h2>{editingId ? "Modifier la formation" : "Créer une formation"}</h2></div>
              <button type="button" onClick={beginCreate} aria-label="Effacer le formulaire"><X size={17} /></button>
            </header>
            <form onSubmit={handleSubmit}>
              <label>Titre de la formation<input name="title" value={form.title} onChange={updateField} required maxLength={100} /></label>
              <div className="admin-form-row">
                <label>Catégorie<input name="category" value={form.category} onChange={updateField} required maxLength={60} /></label>
                <label>Niveau<select name="level" value={form.level} onChange={updateField}><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></label>
              </div>
              <div className="admin-form-row">
                <label>Formateur<input name="instructor" value={form.instructor} onChange={updateField} required maxLength={80} /></label>
                <label>Durée<input name="duration" value={form.duration} onChange={updateField} required placeholder="Ex. 6 heures" maxLength={30} /></label>
              </div>
              <fieldset className="admin-image-fieldset">
                <legend>Image de la formation</legend>
                <div className="admin-image-tabs">
                  <button
                    type="button"
                    className={`admin-image-tab ${imageInputMode === "url" ? "is-active" : ""}`}
                    onClick={() => handleImageModeChange("url")}
                  >
                    <Globe size={15} /> Ajouter par URL
                  </button>
                  <button
                    type="button"
                    className={`admin-image-tab ${imageInputMode === "file" ? "is-active" : ""}`}
                    onClick={() => handleImageModeChange("file")}
                  >
                    <Upload size={15} /> Importer depuis mon ordinateur
                  </button>
                </div>

                {imageInputMode === "url" && (
                  <>
                    <label>
                      URL de l’image<input name="image" type="url" value={form.image} onChange={updateField} placeholder="https://monsite.com/image.png" />
                    </label>
                    {form.image && (
                      <div className="admin-image-preview">
                        <img src={form.image} alt="Aperçu" />
                        <button type="button" className="admin-image-remove" onClick={clearImage} aria-label="Supprimer l’image">×</button>
                      </div>
                    )}
                  </>
                )}

                {imageInputMode === "file" && (
                  <>
                    <label className="admin-image-upload">
                      <Upload size={18} />
                      <span>Sélectionner une image (PNG, JPG, JPEG, WEBP)</span>
                      <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImageFileChange} aria-label="Sélectionner une image" />
                    </label>
                    {imagePreview && (
                      <div className="admin-image-preview">
                        <img src={imagePreview} alt="Aperçu" />
                        <button type="button" className="admin-image-remove" onClick={clearImage} aria-label="Supprimer l’image">×</button>
                      </div>
                    )}
                  </>
                )}
              </fieldset>
              <label>Description courte<textarea name="shortDescription" value={form.shortDescription} onChange={updateField} required rows={2} maxLength={180} /></label>
              <label>Description complète<textarea name="description" value={form.description} onChange={updateField} required rows={4} maxLength={1200} /></label>
              {!editingId && <p className="admin-draft-hint">La nouvelle formation sera créée comme brouillon avec un module d’introduction. Tu pourras la publier depuis le catalogue.</p>}
              <button type="submit" className="admin-save-button"><Check size={16} /> {editingId ? "Enregistrer les modifications" : "Créer le brouillon"}</button>
            </form>
          </section>
        </div>
        ) : (
          <AdminTools section={activeSection === "courses" ? "modules" : activeSection} courses={allCourses} onSaveCourses={persistCourses} />
        )}
        <footer className="admin-footer">LearnSpace · Administration de démonstration locale</footer>
      </div>
      </div>
    </main>
  );
}
