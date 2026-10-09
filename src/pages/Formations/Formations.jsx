import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../../components/CourseCard.jsx";
import { courses, categories } from "../../data/courses.js";
import courseReact from "../../assets/course-react.webp";
import courseDesign from "../../assets/course-design.webp";
import courseMarketing from "../../assets/course-marketing.webp";
import courseOffice from "../../assets/course-office.webp";

const courseImages = {
  "react-debutant": courseReact,
  "design-graphique": courseDesign,
  "marketing-digital": courseMarketing,
  bureautique: courseOffice
};

export default function Formations() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "Toutes");
  const [level, setLevel] = useState("Tous");
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState("grid");

  const filtered = useMemo(() => {
    let result = courses.filter((course) => {
      const matchesSearch = `${course.title} ${course.shortDescription} ${course.category}`.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && (category === "Toutes" || course.category === category) && (level === "Tous" || course.level === level);
    });
    if (sort === "title") result = [...result].sort((a,b) => a.title.localeCompare(b.title, "fr"));
    if (sort === "duration") result = [...result].sort((a,b) => parseInt(a.duration) - parseInt(b.duration));
    if (sort === "rating") result = [...result].sort((a,b) => Number(b.rating) - Number(a.rating));
    return result;
  }, [search, category, level, sort]);

  return <section className="page-section"><div className="container"><div className="page-heading"><span className="eyebrow">APPRENDS À TON RYTHME</span><h1>Catalogue des formations</h1><p>Recherche un cours, filtre par catégorie ou choisis ton niveau.</p></div>
    <div className="catalog-toolbar panel"><label className="search-field"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une formation..." /></label><label className="filter-field"><span>Catégorie</span><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="filter-field"><span>Niveau</span><select value={level} onChange={(e) => setLevel(e.target.value)}>{["Tous","Débutant","Intermédiaire","Avancé"].map((item) => <option key={item}>{item}</option>)}</select></label><label className="filter-field"><span>Trier par</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="popular">Popularité</option><option value="title">Titre</option><option value="duration">Durée</option><option value="rating">Note</option></select></label><div className="view-switch"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Affichage en grille">▦</button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="Affichage en liste">☰</button></div></div>
    <div className="results-line"><span><strong>{filtered.length}</strong> formation(s) trouvée(s)</span><button className="text-link" onClick={() => {setSearch("");setCategory("Toutes");setLevel("Tous");setSort("popular");}}>Réinitialiser les filtres</button></div>
    {filtered.length ? <div className={`course-grid ${view === "list" ? "list-view" : ""}`}>{filtered.map((course) => <CourseCard course={course} image={courseImages[course.id]} key={course.id} />)}</div> : <div className="empty-state panel"><span>🔎</span><h2>Aucune formation trouvée</h2><p>Essaie un autre mot-clé ou modifie les filtres.</p><button className="button" onClick={() => {setSearch("");setCategory("Toutes");setLevel("Tous");}}>Effacer les filtres</button></div>}
  </div></section>;
}
