import { Link } from "react-router-dom";
import { getCourseProgress, getFavorites, saveFavorites } from "../utils/storage.js";
import { useState } from "react";

export default function CourseCard({ course, image }) {
  const [favorites, setFavorites] = useState(getFavorites());
  const favorite = favorites.includes(course.id);
  const progress = getCourseProgress(course.id, course);

  function toggleFavorite() {
    const next = favorite ? favorites.filter((id) => id !== course.id) : [...favorites, course.id];
    setFavorites(next);
    saveFavorites(next);
  }

  return (
    <article className="course-card">
      <div className={`course-art art-${course.color}`}>
        {image ? <img className="course-art-icon" src={image} alt="" /> : <span className="course-art-icon">{course.icon}</span>}
        <span className="art-label">{course.category}</span>
        <button className={`favorite-button ${favorite ? "is-favorite" : ""}`} onClick={toggleFavorite} aria-label="Ajouter aux favoris">
          {favorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="course-card-body">
        <div className="course-meta"><span>{course.level}</span><span>◷ {course.duration}</span></div>
        <h3><Link to={`/formations/${course.id}`}>{course.title}</Link></h3>
        <p>{course.shortDescription}</p>
        <div className="course-details"><span>▤ {course.modulesCount} modules</span><span>♙ {course.students.toLocaleString("fr-FR")} étudiants</span></div>
        {progress > 0 && <div className="mini-progress"><div><span>Ta progression</span><strong>{progress}%</strong></div><span className="mini-track"><span style={{ width: `${progress}%` }} /></span></div>}
        <div className="course-card-bottom"><span className="rating">★ {course.rating}</span><Link to={`/formations/${course.id}`} className="text-link">Voir le cours →</Link></div>
      </div>
    </article>
  );
}
