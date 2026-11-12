import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CircleCheck,
  Clock3,
  FileText,
  LockKeyhole,
  Share2,
  Video,
} from "lucide-react";
import { getAllChapters, getCourse } from "../../data/courses.js";
import { getDemoRole } from "../../utils/demoAuth.js";
import { getCertificateSettings } from "../../utils/adminSettings.js";
import { getCertificateEligibility } from "../../utils/certificateEligibility.js";
import { issueCertificate } from "../../utils/certificateTemplates.js";
import {
  getCourseProgress,
  getLastChapter,
  getProgress,
  getProfile,
  getResumeChapter,
  saveLastChapter,
  saveEnrollment,
  saveProgress,
} from "../../utils/storage.js";
import ModuleResources from "../../components/ModuleResources.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import Quiz from "../../components/Quiz.jsx";
import NotFound from "../NotFound.jsx";
import "./CoursePlayer.css";

function getVideoFileUrl(url = "") {
  return /\.(mp4|webm|ogg)(?:$|[?#])/i.test(url) ? url : null;
}

function getModuleType(module) {
  const hasVideo = module.chapters.some((chapter) => chapter.videoEmbedUrl || getVideoFileUrl(chapter.videoUrl));
  const hasPdf = module.resources.some((resource) => resource.type?.toLowerCase().includes("pdf"));
  if (hasVideo && hasPdf) return "Vidéo · PDF";
  if (hasVideo) return "Vidéo";
  if (hasPdf) return "PDF";
  return "Lecture";
}

function getInstructorInitials(instructor) {
  return instructor
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function CoursePlayer() {
  const { id } = useParams();
  const course = useMemo(() => getCourse(id), [id]);
  const isStudent = getDemoRole() === "STUDENT";
  const [searchParams, setSearchParams] = useSearchParams();
  const [completedByCourse, setCompletedByCourse] = useState(() => isStudent ? getProgress() : {});
  const [shareMessage, setShareMessage] = useState("");
  const [shareError, setShareError] = useState("");
  const [certificateIssueError, setCertificateIssueError] = useState("");
  const chapters = useMemo(() => course ? getAllChapters(course) : [], [course]);
  const resumeChapter = course && isStudent ? getResumeChapter(course) : null;
  const requestedChapter = searchParams.get("chapter");
  const activeChapter = chapters.find((chapter) => chapter.id === requestedChapter)
    || (isStudent ? chapters.find((chapter) => chapter.id === getLastChapter(id)) : null)
    || resumeChapter
    || chapters[0]
    || null;
  const activeModuleIndex = course
    ? course.modules.findIndex((module) => module.chapters.some((chapter) => chapter.id === activeChapter?.id))
    : -1;
  const activeModule = activeModuleIndex >= 0 ? course.modules[activeModuleIndex] : null;
  const completedChapters = Array.isArray(completedByCourse[id]) ? completedByCourse[id] : [];
  const completedModules = course
    ? course.modules.map((module) => module.chapters.every((chapter) => completedChapters.includes(chapter.id)))
    : [];
  const completedModuleCount = completedModules.filter(Boolean).length;
  const progress = course && isStudent ? getCourseProgress(course.id, course) : 0;
  const moduleIsComplete = activeModule ? completedModules[activeModuleIndex] : false;
  const previousModule = activeModuleIndex > 0 ? course.modules[activeModuleIndex - 1] : null;
  const nextModule = activeModuleIndex >= 0 ? course?.modules[activeModuleIndex + 1] : null;
  const nextModuleUrl = nextModule ? `/course/${course.id}?chapter=${nextModule.chapters[0].id}` : null;
  const nextIsLocked = Boolean(activeModule?.quiz?.required && !moduleIsComplete);
  const availableLessonCount = course
    ? chapters.filter((chapter) => completedChapters.includes(chapter.id)).length
    : 0;
  const certificateSettings = getCertificateSettings();
  const certificateEligibility = course && isStudent
    ? getCertificateEligibility(course, certificateSettings)
    : null;

  useEffect(() => {
    if (isStudent && course && activeChapter) saveLastChapter(course.id, activeChapter.id);
  }, [course, activeChapter, isStudent]);

  useEffect(() => {
    if (!isStudent || !course) return;
    const profile = getProfile();
    if (profile.email) {
      saveEnrollment({
        courseId: course.id,
        email: profile.email,
        studentName: `${profile.firstName} ${profile.lastName}`.trim(),
      });
    }
  }, [course, isStudent]);

  useEffect(() => {
    if (!isStudent || !course || !certificateSettings.enabled || !certificateEligibility?.eligible) return;
    try {
      issueCertificate(course, certificateEligibility);
      setCertificateIssueError("");
    } catch (error) {
      setCertificateIssueError(error instanceof Error ? error.message : "Le certificat n’a pas pu être généré.");
    }
  }, [course, isStudent, certificateSettings.enabled, certificateEligibility?.eligible]);

  if (!isStudent) {
    return (
      <main className="course-player-page">
        <section className="course-player-video-unavailable">
          <strong>Réservé à l’espace étudiant</strong>
          <span>Le compte administrateur n’a pas de progression pédagogique personnelle.</span>
          <Link to="/admin">Retour au Dashboard Admin</Link>
        </section>
      </main>
    );
  }
  if (!course || !activeChapter || !activeModule) return <NotFound />;

  function selectChapter(chapterId) {
    setSearchParams({ chapter: chapterId });
  }

  function selectModule(module) {
    if (!module) return;
    const stored = Array.isArray(completedByCourse[course.id]) ? completedByCourse[course.id] : [];
    const chapter = module.chapters.find((item) => !stored.includes(item.id)) || module.chapters[0];
    selectChapter(chapter.id);
  }

  function completeModule() {
    if (!isStudent) return;
    const existing = Array.isArray(completedByCourse[course.id]) ? completedByCourse[course.id] : [];
    const nextCompleted = [...new Set([...existing, ...activeModule.chapters.map((chapter) => chapter.id)])];
    const nextProgress = { ...completedByCourse, [course.id]: nextCompleted };
    saveProgress(nextProgress);
    setCompletedByCourse(nextProgress);
  }

  async function shareCourse() {
    setShareError("");
    setShareMessage("");
    try {
      if (navigator.share) {
        await navigator.share({ title: course.title, url: window.location.href });
        setShareMessage("Lien partagé.");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage("Lien copié.");
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
      setShareError("Impossible de partager ce lien depuis ce navigateur.");
    }
  }

  const videoFileUrl = getVideoFileUrl(activeChapter.videoUrl);

  return (
    <main className="course-player-page">
      <header className="course-player-topbar">
        <Link className="course-player-back" to="/dashboard" state={{ dashboardSection: "Cours" }}>
          <ArrowLeft size={17} /> Quitter le cours
        </Link>
        <Link className="course-player-brand" to="/dashboard" aria-label="Retour au Dashboard LearnSpace">
          Learn<span>Space</span>
        </Link>
      </header>

      <div className="course-player-layout">
        <article className="course-player-main">
          <header className="course-player-heading">
            <div>
              <span className="course-player-eyebrow">{course.category} <span>·</span> {course.level}</span>
              <h1>{course.title}</h1>
              <p>{activeModule.title} <span>·</span> {activeChapter.title}</p>
            </div>
            <span className="course-player-course-progress">{progress}% terminé</span>
          </header>

          <div className="course-player-video">
            {videoFileUrl ? (
              <video key={videoFileUrl} controls playsInline preload="metadata" src={videoFileUrl}>
                Ton navigateur ne prend pas en charge la lecture de cette vidéo.
              </video>
            ) : activeChapter.videoEmbedUrl ? (
              <iframe
                key={activeChapter.videoEmbedUrl}
                src={activeChapter.videoEmbedUrl}
                title={`Vidéo : ${activeChapter.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="course-player-video-unavailable">
                <BookOpen size={35} />
                <strong>Leçon à consulter</strong>
                <span>Aucune vidéo n’est disponible pour cette leçon. Son contenu pédagogique est présenté ci-dessous.</span>
              </div>
            )}
          </div>

          <div className="course-player-instructor-row">
            <div className="course-player-instructor">
              <span className="course-player-avatar" aria-hidden="true">{getInstructorInitials(course.instructor)}</span>
              <span><small>Formateur</small><strong>{course.instructor}</strong></span>
            </div>
            <div className="course-player-share">
              <button type="button" onClick={shareCourse}><Share2 size={16} /> Partager</button>
              {shareMessage && <span role="status">{shareMessage}</span>}
              {shareError && <span role="alert">{shareError}</span>}
            </div>
          </div>

          <nav className="course-player-module-nav" aria-label="Navigation entre les modules">
            <button type="button" disabled={!previousModule} onClick={() => selectModule(previousModule)}>
              <ArrowLeft size={16} /> Module précédent
            </button>
            <button type="button" disabled={!nextModule || nextIsLocked} onClick={() => selectModule(nextModule)}>
              {nextIsLocked ? <LockKeyhole size={15} /> : null}
              Module suivant <ArrowRight size={16} />
            </button>
          </nav>

          <section className="course-player-section">
            <span className="course-player-section-label">À PROPOS DE CETTE FORMATION</span>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p className="course-player-current-content">{activeChapter.content}</p>
          </section>

          <section className="course-player-section course-player-suitable">
            <span className="course-player-section-label">À QUI S’ADRESSE CETTE FORMATION ?</span>
            <h2>Un parcours adapté à ton niveau</h2>
            <ul>
              <li><Check size={16} /> Niveau {course.level.toLowerCase()}</li>
              <li><Check size={16} /> Intéressé·e par la catégorie {course.category.toLowerCase()}</li>
              <li><Check size={16} /> Un parcours de {course.duration} avec {course.modules.length} modules</li>
            </ul>
          </section>

          <section className="course-player-section course-player-objectives">
            <span className="course-player-section-label">OBJECTIFS PÉDAGOGIQUES</span>
            <h2>Ce que tu vas apprendre</h2>
            <ul>
              {course.objectives.map((objective) => <li key={objective}><CircleCheck size={17} /> {objective}</li>)}
            </ul>
          </section>

          <ModuleResources
            resources={activeModule.resources}
            courseId={course.id}
            moduleId={activeModule.id}
          />

          {activeModule.quiz?.questions.length > 0 && (
            <div className="course-player-quiz">
              <Quiz
                key={activeModule.quiz.id}
                course={course}
                quiz={activeModule.quiz}
                moduleId={activeModule.id}
                moduleTitle={activeModule.title}
                nextUrl={nextModuleUrl}
                canProceed={moduleIsComplete}
                onPass={completeModule}
              />
            </div>
          )}
        </article>

        <aside className="course-player-sidebar">
          <section className="course-player-progress-card" aria-label="Progression de la formation">
            <div className="course-player-progress-heading">
              <span><BookOpen size={17} /> Ta progression</span>
              <strong>{progress}%</strong>
            </div>
            <ProgressBar value={progress} label="Formation terminée" />
            <div className="course-player-progress-stats">
              <span><strong>{completedModuleCount}/{course.modules.length}</strong> modules terminés</span>
              <span><strong>{availableLessonCount}/{chapters.length}</strong> leçons terminées</span>
            </div>
            {certificateEligibility?.eligible && (
              <Link className="course-player-certificate-link" to={`/certificats/${course.id}`}>
                Voir mon certificat de réussite
              </Link>
            )}
            {certificateIssueError && <p className="course-player-certificate-error" role="alert">{certificateIssueError}</p>}
          </section>

          <section className="course-player-modules-card">
            <header>
              <div><span className="course-player-section-label">PROGRAMME</span><h2>Contenu du cours</h2></div>
              <span className="course-player-module-count">{course.modules.length}</span>
            </header>
            <div className="course-player-module-list">
              {course.modules.map((module, index) => {
                const isActive = module.id === activeModule.id;
                const isComplete = completedModules[index];
                const isLocked = index > 0
                  && course.modules.slice(0, index).some((previous, previousIndex) =>
                    previous.quiz?.required && !completedModules[previousIndex]
                  );
                const type = getModuleType(module);

                return (
                  <section
                    className={`course-player-module ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""} ${isLocked ? "is-locked" : ""}`}
                    key={module.id}
                  >
                    <button
                      type="button"
                      className="course-player-module-button"
                      disabled={isLocked}
                      aria-current={isActive ? "step" : undefined}
                      onClick={() => selectModule(module)}
                    >
                      <span className="course-player-module-icon">
                        {isLocked ? <LockKeyhole size={16} /> : isComplete ? <CircleCheck size={17} /> : type.includes("PDF") ? <FileText size={16} /> : type.includes("Vidéo") ? <Video size={16} /> : <BookOpen size={16} />}
                      </span>
                      <span className="course-player-module-copy">
                        <strong>{module.order || index + 1}. {module.title}</strong>
                        <small><Clock3 size={12} /> {module.duration || "Durée non renseignée"} <span>·</span> {type}</small>
                      </span>
                      <span className="course-player-module-status">
                        {isLocked ? "Verrouillé" : isComplete ? "Terminé" : isActive ? "En cours" : "Disponible"}
                      </span>
                    </button>
                    {isActive && (
                      <ol className="course-player-lessons">
                        {module.chapters.map((chapter) => (
                          <li key={chapter.id}>
                            <button
                              className={chapter.id === activeChapter.id ? "is-current" : ""}
                              type="button"
                              onClick={() => selectChapter(chapter.id)}
                            >
                              <span>{completedChapters.includes(chapter.id) ? <CircleCheck size={14} /> : <Video size={14} />}</span>
                              {chapter.title}
                            </button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
