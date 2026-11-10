import { Download, FileText } from "lucide-react";
import { courses } from "../data/courses.js";
import "./CourseLibrary.css";

export default function CourseLibrary() {
  return (
    <section className="course-library">
      <header className="library-header">
        <span className="library-badge">RESSOURCES</span>
        <h1>Bibliothèque de cours</h1>
        <p>Télécharge tes supports de formation et apprends à ton rythme.</p>
      </header>

      <div className="library-grid">
        {courses.map((course) => (
          <article className="pdf-card" key={course.id}>
            <div className="pdf-icon" aria-hidden="true">
              <FileText size={23} />
              <span>PDF</span>
            </div>

            <div className="pdf-content">
              <span className="pdf-category">{course.category}</span>
              <h2>{course.title}</h2>
              <p>{course.shortDescription}</p>
              <span className="pdf-size">Support PDF · bientôt disponible</span>
            </div>

            <button type="button" className="pdf-download" disabled>
              <span>Téléchargement bientôt disponible</span>
              <Download size={17} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
