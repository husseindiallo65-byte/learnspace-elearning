import { useState } from "react";
import { ArrowLeft, BookOpen, FileText, Video } from "lucide-react";
import CourseLibrary from "./CourseLibrary.jsx";
import CourseVideoPlayer from "./CourseVideoPlayer.jsx";
import "./CourseHub.css";

const courseFormats = [
  {
    id: "videos",
    title: "Cours vidéos",
    description: "Suis les leçons en vidéo et avance chapitre par chapitre.",
    icon: Video,
  },
  {
    id: "pdf",
    title: "Cours PDF",
    description: "Retrouve les supports écrits et consulte les ressources disponibles.",
    icon: FileText,
  },
];

export default function CourseHub() {
  const [selectedFormat, setSelectedFormat] = useState(null);

  return (
    <section className="course-hub">
      {selectedFormat ? (
        <div className="course-hub-inner-page">
          <button className="course-hub-back" type="button" onClick={() => setSelectedFormat(null)}>
            <ArrowLeft size={17} /> Retour aux formats de cours
          </button>
          {selectedFormat === "videos" ? <CourseVideoPlayer /> : <CourseLibrary />}
        </div>
      ) : (
        <>
          <header className="course-hub-header">
            <span className="course-hub-eyebrow"><BookOpen size={16} /> TON ESPACE DE FORMATION</span>
            <h1>Choisis ton format de cours</h1>
            <p>Accède aux formations vidéo ou aux supports PDF depuis le même espace.</p>
          </header>

          <div className="course-format-options" aria-label="Choisir un format de cours">
            {courseFormats.map(({ id, title, description, icon: Icon }) => (
              <button
                type="button"
                key={id}
                className="course-format-card"
                onClick={() => setSelectedFormat(id)}
              >
                <span className="course-format-icon"><Icon size={22} /></span>
                <span className="course-format-copy">
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <span className="course-format-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
