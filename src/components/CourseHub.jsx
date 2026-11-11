import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock3, Play, Search } from "lucide-react";
import { courses } from "../data/courses.js";
import { getCourseProgress, getLastChapter } from "../utils/storage.js";
import courseReact from "../assets/course-react.webp";
import courseDesign from "../assets/course-design.webp";
import courseMarketing from "../assets/course-marketing.webp";
import courseOffice from "../assets/course-office.webp";
import "./CourseHub.css";

const courseCovers = {
  "react-debutant": courseReact,
  "design-graphique": courseDesign,
  "marketing-digital": courseMarketing,
  bureautique: courseOffice,
  "html-css": "https://i.ibb.co/XZdxVW2V/html-programming-advanced-technology-web-concept.jpg",
  "javascript-debutant": "https://i.ibb.co/CGhVdv0/teleworker-using-laptop-coding-software-developing.jpg",
};

function getCourseStatus(progress, hasBeenVisited) {
  if (progress === 100) return { label: "Terminée", className: "is-complete" };
  if (progress > 0 || hasBeenVisited) return { label: "En cours", className: "is-progress" };
  return { label: "Non commencée", className: "is-new" };
}

export default function CourseHub() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const categories = useMemo(
    () => ["Toutes", ...new Set(courses.map((course) => course.category))],
    [],
  );
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = category === "Toutes" || course.category === category;
    const matchesSearch = `${course.title} ${course.category} ${course.instructor}`
      .toLocaleLowerCase("fr")
      .includes(search.toLocaleLowerCase("fr").trim());
    return matchesCategory && matchesSearch;
  });

  const startedCount = courses.filter((course) =>
    getCourseProgress(course.id, course) > 0 || Boolean(getLastChapter(course.id))
  ).length;

  return (
    <section className="course-hub">
      <header className="course-hub-header">
        <span className="course-hub-eyebrow"><BookOpen size={16} /> TON ESPACE DE FORMATION</span>
        <h1>Mes cours</h1>
        <p>Retrouve tes formations, suis tes progrès et reprends tes leçons à ton rythme.</p>
        <div className="course-hub-summary" aria-label="Résumé des formations">
          <span><strong>{courses.length}</strong> formations disponibles</span>
          <span><strong>{startedCount}</strong> commencée{startedCount > 1 ? "s" : ""}</span>
        </div>
      </header>

      <div className="course-hub-toolbar">
        <label className="course-hub-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une formation..."
            aria-label="Rechercher une formation"
          />
        </label>
        <label className="course-hub-filter">
          <span>Catégorie</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {filteredCourses.length ? (
        <div className="course-hub-grid">
          {filteredCourses.map((course) => {
            const progress = getCourseProgress(course.id, course);
            const lastChapter = getLastChapter(course.id);
            const status = getCourseStatus(progress, Boolean(lastChapter));
            const chapters = course.modules.flatMap((module) => module.chapters);
            const cover = course.image || courseCovers[course.id];
            const lessonUrl = `/course/${course.id}`;

            return (
              <article className="course-hub-card" key={course.id}>
                <Link className="course-hub-cover" to={`/formations/${course.id}`} aria-label={`Voir ${course.title}`}>
                  {cover
                    ? <img src={cover} alt="" loading="lazy" />
                    : <span className="course-hub-cover-fallback" aria-hidden="true">{course.icon}</span>}
                  <span className={`course-hub-status ${status.className}`}>{status.label}</span>
                </Link>
                <div className="course-hub-card-body">
                  <div className="course-hub-card-meta">
                    <span>{course.category}</span>
                    <span>{progress}%</span>
                  </div>
                  <h2><Link to={`/formations/${course.id}`}>{course.title}</Link></h2>
                  <p className="course-hub-instructor">Par {course.instructor}</p>
                  <div className="course-hub-facts">
                    <span><BookOpen size={14} /> {course.modules.length} modules</span>
                    <span><Clock3 size={14} /> {course.duration}</span>
                  </div>
                  <div
                    className="course-hub-progress"
                    role="progressbar"
                    aria-label={`Progression de ${course.title}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <div className="course-hub-progress-label">
                    <span>{progress === 100 ? "Formation terminée" : `${chapters.length} leçons`}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="course-hub-actions">
                    <Link className="course-hub-primary-action" to={lessonUrl}>
                      <Play size={15} fill="currentColor" />
                      {progress === 0 ? "Commencer" : progress === 100 ? "Revoir le cours" : "Continuer la formation"}
                    </Link>
                    <Link className="course-hub-details-action" to={`/formations/${course.id}`} aria-label={`Détails de ${course.title}`}>
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="course-hub-empty" role="status">
          <BookOpen size={24} />
          <h2>Aucune formation trouvée</h2>
          <p>Essaie un autre titre ou une autre catégorie.</p>
          <button type="button" onClick={() => { setSearch(""); setCategory("Toutes"); }}>
            Effacer les filtres
          </button>
        </div>
      )}
    </section>
  );
}
