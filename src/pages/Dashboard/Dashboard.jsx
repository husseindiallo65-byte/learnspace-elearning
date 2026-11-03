import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCourseProgress, getProfile, getProgress, getQuizResults, getStudyPlan, saveProfile, saveStudyPlan } from "../../utils/storage.js";
import { courses, getAllChapters } from "../../data/courses.js";
import { logoutDemoAccount } from "../../utils/demoAuth.js";
import instagramIcon from "../../assets/social/instagram.png";
import youtubeIcon from "../../assets/social/youtube.png";
import linkedinIcon from "../../assets/social/linkedin.png";
import tiktokIcon from "../../assets/social/tiktok.png";
import {
  BookOpen, LayoutDashboard, GraduationCap, BookMarked,
  Settings, Star, Bell, CircleHelp, LogOut, ChevronDown,
  ChevronLeft, ChevronRight, FileText, Mic,
  Brain, Monitor, Download, ArrowRight, Menu, ClipboardCheck,
  X, Flame, Target, CheckCircle2, User, UserRound, Globe, Moon, Shield, Mail, Award, RotateCcw, Clock3
} from "lucide-react";
import courseReactImg from "../../assets/course-react.webp";
import courseDesignImg from "../../assets/course-design.webp";
import courseMarketingImg from "../../assets/course-marketing.webp";
import courseOfficeImg from "../../assets/course-office.webp";
import "./Dashboard.css";

const menuItems = [
  { label: "Tableau de bord", icon: LayoutDashboard },
  { label: "Centre d'étude", icon: BookOpen },
  { label: "Tests blancs", icon: Monitor },
  { label: "Vocabulaire", icon: BookMarked },
  { label: "VIP", icon: Star },
  { label: "Notifications", icon: Bell },
  { label: "Contact", icon: FileText },
  { label: "Aide (Q&R)", icon: CircleHelp },
  { label: "Paramètres", icon: Settings },
  { label: "Se déconnecter", icon: LogOut },
];

const resources = [
  { title: "Vocabulaire", subtitle: "90% du vocabulaire d'examen", icon: FileText },
  { title: "Expression orale", subtitle: "Améliore ton oral en 14 jours", icon: Mic },
  { title: "Analyse IA", subtitle: "Précision en 14 jours", icon: Brain },
  { title: "Tests blancs", subtitle: "Tests types PTE", icon: Monitor },
];

const lessons = [
  { title: "Guide PTE", image: "https://i.ibb.co/ymLkZPnD/banni-re.jpg" },
  { title: "Expression orale", image: "https://i.ibb.co/ksWrbbLs/banni-re2.jpg" },
  { title: "Expression écrite", image: courseMarketingImg },
  { title: "Compréhension écrite", image: courseOfficeImg },
  { title: "Compréhension orale", image: courseReactImg },
  { title: "Modèles", image: courseDesignImg },
];

const levelTestQuestions = [
  {
    question: "Choose the correct sentence.",
    options: ["She go to school every day.", "She goes to school every day.", "She going to school every day."],
    answer: 1,
  },
  {
    question: "What is the closest meaning of “rapid”?",
    options: ["Slow", "Quick", "Quiet"],
    answer: 1,
  },
  {
    question: "Complete the sentence: “I have lived here ___ 2022.”",
    options: ["for", "since", "during"],
    answer: 1,
  },
  {
    question: "Choose the best response: “Would you mind opening the window?”",
    options: ["Not at all.", "Yes, I would mind.", "I opened yesterday."],
    answer: 0,
  },
  {
    question: "Complete the sentence: “If I had more time, I ___ another course.”",
    options: ["take", "will take", "would take"],
    answer: 2,
  },
  {
    question: "What does “to improve” mean?",
    options: ["To make something better", "To forget something", "To finish something"],
    answer: 0,
  },
];

const studyTasks = [
  { id: "lesson", label: "Suivre un chapitre de formation", detail: "Avance à ton rythme dans une leçon." },
  { id: "practice", label: "Faire un exercice ou un quiz", detail: "Vérifie tes connaissances après ta leçon." },
  { id: "review", label: "Réviser une notion importante", detail: "Prends quelques minutes pour consolider tes acquis." },
];

const vocabularyCategories = ["Tout", "Études", "Travail", "Vie quotidienne"];
const vocabularyWords = [
  { word: "Achieve", translation: "Atteindre, réaliser", example: "She achieved her goal after months of practice.", category: "Études", choices: ["Éviter", "Atteindre, réaliser", "Oublier"] },
  { word: "Improve", translation: "Améliorer", example: "Reading every day can improve your vocabulary.", category: "Études", choices: ["Améliorer", "Remplacer", "Commencer"] },
  { word: "Reliable", translation: "Fiable", example: "A reliable source gives accurate information.", category: "Études", choices: ["Compliqué", "Fiable", "Rapide"] },
  { word: "Deadline", translation: "Date limite", example: "The project deadline is next Friday.", category: "Travail", choices: ["Réunion", "Date limite", "Promotion"] },
  { word: "Attend", translation: "Assister à", example: "All team members will attend the meeting.", category: "Travail", choices: ["Assister à", "Organiser", "Annuler"] },
  { word: "Colleague", translation: "Collègue", example: "I discussed the report with a colleague.", category: "Travail", choices: ["Client", "Collègue", "Responsable"] },
  { word: "Purchase", translation: "Acheter, achat", example: "You can purchase a ticket online.", category: "Vie quotidienne", choices: ["Vendre", "Acheter, achat", "Emprunter"] },
  { word: "Borrow", translation: "Emprunter", example: "Can I borrow your pen for a moment?", category: "Vie quotidienne", choices: ["Emprunter", "Rendre", "Prêter"] },
  { word: "Convenient", translation: "Pratique, commode", example: "Online payment is convenient and quick.", category: "Vie quotidienne", choices: ["Bruyant", "Pratique, commode", "Dangereux"] },
];

const studyCourseIcons = {
  "Développement web": BookOpen,
  "Design graphique": Target,
  "Marketing digital": Globe,
  Bureautique: Monitor,
};

function getLocalDateKey() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export default function Dashboard() {
  const [profile, setProfile] = useState(() => getProfile());
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Tableau de bord");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [levelTestAnswers, setLevelTestAnswers] = useState({});
  const [levelTestResult, setLevelTestResult] = useState(null);
  const [dashboardContactNotice, setDashboardContactNotice] = useState("");
  const [vocabularyCategory, setVocabularyCategory] = useState("Tout");
  const [vocabularyIndex, setVocabularyIndex] = useState(0);
  const [showVocabularyTranslation, setShowVocabularyTranslation] = useState(false);
  const [vocabularyQuizIndex, setVocabularyQuizIndex] = useState(0);
  const [vocabularyQuizAnswer, setVocabularyQuizAnswer] = useState("");
  const [vocabularyQuizScore, setVocabularyQuizScore] = useState(0);
  const [vocabularyQuizComplete, setVocabularyQuizComplete] = useState(false);
  const [studyDate] = useState(getLocalDateKey);
  const [completedStudyTasks, setCompletedStudyTasks] = useState(() => getStudyPlan(getLocalDateKey()));
  const [banner, setBanner] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedProfile = { ...profile, photo: reader.result };
      setProfile(updatedProfile);
      saveProfile(updatedProfile);
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = "";
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const banners = [
    {
      title: "Tests blancs PTE Master",
      subtitle: "Entraîne-toi intelligemment. Atteins ton objectif.",
      button: "En savoir plus",
      image: courseMarketingImg,
    },
    {
      title: "Ton succès commence ici",
      subtitle: "Pratique tous les jours et améliore ton score.",
      button: "Commencer",
      image: courseReactImg,
    },
  ];

  const currentBanner = banners[banner];
  const nextBanner = () => setBanner((banner + 1) % banners.length);
  const previousBanner = () => setBanner((banner - 1 + banners.length) % banners.length);

  const submitLevelTest = (event) => {
    event.preventDefault();
    const correct = levelTestQuestions.reduce(
      (total, question, index) => total + (Number(levelTestAnswers[index]) === question.answer ? 1 : 0),
      0,
    );
    const percentage = Math.round((correct / levelTestQuestions.length) * 100);
    const level = percentage < 40 ? "Débutant" : percentage < 75 ? "Intermédiaire" : "Avancé";
    setLevelTestResult({ correct, total: levelTestQuestions.length, percentage, level });
  };

  const restartLevelTest = () => {
    setLevelTestAnswers({});
    setLevelTestResult(null);
  };

  const toggleStudyTask = (taskId) => {
    setCompletedStudyTasks((completed) => {
      const next = completed.includes(taskId)
        ? completed.filter((id) => id !== taskId)
        : [...completed, taskId];
      saveStudyPlan(studyDate, next);
      return next;
    });
  };

  const progressByCourse = getProgress();
  const recentQuizResults = getQuizResults().slice(0, 5);
  const coursesInProgress = courses.filter((course) => {
    const progress = getCourseProgress(course.id, course);
    return progress > 0 && progress < 100;
  });
  const totalCompletedChapters = courses.reduce(
    (total, course) => total + (Array.isArray(progressByCourse[course.id]) ? progressByCourse[course.id].length : 0),
    0,
  );
  const getCourseResumeChapter = (course) => {
    const chapters = getAllChapters(course);
    const completed = progressByCourse[course.id] || [];
    return chapters.find((chapter) => !completed.includes(chapter.id)) || chapters[0];
  };
  const filteredVocabulary = vocabularyCategory === "Tout"
    ? vocabularyWords
    : vocabularyWords.filter((item) => item.category === vocabularyCategory);
  const currentVocabulary = filteredVocabulary[vocabularyIndex];
  const currentVocabularyQuizItem = filteredVocabulary[vocabularyQuizIndex];

  const selectVocabularyCategory = (category) => {
    setVocabularyCategory(category);
    setVocabularyIndex(0);
    setShowVocabularyTranslation(false);
    setVocabularyQuizIndex(0);
    setVocabularyQuizAnswer("");
    setVocabularyQuizScore(0);
    setVocabularyQuizComplete(false);
  };

  const answerVocabularyQuiz = (choice) => {
    if (vocabularyQuizAnswer || !currentVocabularyQuizItem) return;
    setVocabularyQuizAnswer(choice);
    if (choice === currentVocabularyQuizItem.translation) {
      setVocabularyQuizScore((score) => score + 1);
    }
  };

  const nextVocabularyQuizQuestion = () => {
    if (vocabularyQuizIndex === filteredVocabulary.length - 1) {
      setVocabularyQuizComplete(true);
      return;
    }
    setVocabularyQuizIndex((index) => index + 1);
    setVocabularyQuizAnswer("");
  };

  const restartVocabularyQuiz = () => {
    setVocabularyQuizIndex(0);
    setVocabularyQuizAnswer("");
    setVocabularyQuizScore(0);
    setVocabularyQuizComplete(false);
  };

  const handleDashboardContactSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const subject = `Message LearnSpace de ${name}`;
    const body = `Nom : ${name}\nE-mail : ${email}\n\nMessage :\n${message}`;

    setDashboardContactNotice("Ton application de messagerie va s’ouvrir pour préparer le message.");
    window.location.href = `mailto:husseindiallo65@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="pte-app">
      <button className="mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Ouvrir le menu">
        {sidebarOpen ? <X /> : <Menu />}
      </button>
      {sidebarOpen && <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu" />}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <a href="#home" className="pte-logo">
          <span className="logo-symbol"><GraduationCap size={30} /></span>
          <span>Learn<span className="logo-light">Space</span></span>
        </a>

        <div className="sidebar-menu">
          {menuItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`sidebar-link ${activeMenu === label ? "active" : ""}`} onClick={() => { if (label === "Se déconnecter") { logoutDemoAccount(); navigate("/connexion"); return; } setActiveMenu(label); setSidebarOpen(false); if (label === "Paramètres" || label === "Aide (Q&R)" || label === "Contact") window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Flame size={18} />
            <span>Apprends tous les jours !</span>
          </div>
          <button className="collapse-button" aria-label="Réduire le menu"><ChevronLeft size={18} /></button>
        </div>
      </aside>

      <main className={`main-content ${isVisible ? 'fade-in' : ''}`} id="home">
        <header className="pte-navbar">
          <div className="navbar-container">
            <div className="navbar-context">
              <span className="navbar-context-icon"><LayoutDashboard size={18} /></span>
              <span className="navbar-context-copy">
                <strong>Espace étudiant</strong>
                <small>Bienvenue, {profile.firstName || "Étudiant"}</small>
              </span>
            </div>
            <nav className="navbar-links" aria-label="Navigation du tableau de bord">
              <div className="navbar-dropdown">
                <button
                  className="navbar-link"
                  type="button"
                  aria-expanded={practiceOpen}
                  onClick={() => setPracticeOpen((open) => !open)}
                >
                  Pratique PTE <ChevronDown size={15} />
                </button>
                {practiceOpen && (
                  <div className="navbar-dropdown-menu">
                    {["Tests blancs", "Expression orale", "Expression écrite", "Compréhension écrite", "Compréhension orale"].map((title) => (
                      <Link key={title} to="/formations" onClick={() => setPracticeOpen(false)}>
                        {title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/formations" className="navbar-link">Cours</Link>
              <Link to="/" className="navbar-link">Application</Link>
            </nav>

            <div className="navbar-actions">
              <button
                className="navbar-notification"
                type="button"
                aria-label="Notifications"
                onClick={() => {
                  setActiveMenu("Notifications");
                  setSidebarOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Bell size={19} />
                <span className="notification-dot" />
              </button>
              <button className="navbar-vip" type="button" onClick={() => setActiveMenu("VIP")}>
                Passer en VIP <Star size={17} />
              </button>
              <div className="navbar-profile-wrapper">
                <label className="navbar-profile" title="Changer la photo de profil">
                  {profile.photo ? (
                    <img src={profile.photo} alt="" />
                  ) : (
                    <UserRound size={20} aria-hidden="true" />
                  )}
                  <input
                    className="navbar-photo-input"
                    type="file"
                    accept="image/*"
                    aria-label="Sélectionner une nouvelle photo de profil"
                    onChange={handleProfilePhotoChange}
                  />
                </label>
              </div>
              <div className="navbar-account-wrapper">
                <button
                  className="navbar-mobile-toggle"
                  type="button"
                  aria-label={accountMenuOpen ? "Fermer le menu du compte" : "Ouvrir le menu du compte"}
                  aria-expanded={accountMenuOpen}
                  onClick={() => setAccountMenuOpen((open) => !open)}
                >
                  {accountMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                {accountMenuOpen && (
                  <div className="navbar-account-menu">
                    <nav className="navbar-account-nav" aria-label="Navigation du tableau de bord">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenu("Tests blancs");
                          setAccountMenuOpen(false);
                        }}
                      >
                        Pratique PTE
                      </button>
                      <Link to="/formations" onClick={() => setAccountMenuOpen(false)}>Cours</Link>
                      <Link to="/" onClick={() => setAccountMenuOpen(false)}>Application</Link>
                    </nav>
                    <Link to="/profil" onClick={() => setAccountMenuOpen(false)}>
                      <UserRound size={16} /> Profil
                    </Link>
                    <button type="button" onClick={() => { logoutDemoAccount(); navigate("/connexion"); }}>
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {activeMenu === "VIP" ? (
          <section className="dashboard-vip-section">
            <header className="dashboard-vip-header">
              <span className="dashboard-vip-eyebrow"><Star size={16} /> LEARNSPACE VIP</span>
              <h1>Apprends avec encore plus d’ambition</h1>
              <p>Découvre les avantages envisagés pour accompagner ta progression et tirer le meilleur de tes formations.</p>
            </header>

            <div className="dashboard-vip-card">
              <div className="dashboard-vip-card-heading">
                <span className="dashboard-vip-star"><Star size={23} /></span>
                <div>
                  <span className="dashboard-vip-label">OFFRE VIP</span>
                  <h2>Un accompagnement renforcé</h2>
                </div>
              </div>
              <div className="dashboard-vip-benefits">
                <article>
                  <span><BookOpen size={19} /></span>
                  <div><h3>Plus de ressources</h3><p>Accède à davantage de supports pour approfondir tes apprentissages.</p></div>
                </article>
                <article>
                  <span><ClipboardCheck size={19} /></span>
                  <div><h3>Entraînement ciblé</h3><p>Multiplie les exercices et les évaluations pour consolider tes acquis.</p></div>
                </article>
                <article>
                  <span><Brain size={19} /></span>
                  <div><h3>Progression guidée</h3><p>Organise tes révisions et avance avec des objectifs adaptés à ton rythme.</p></div>
                </article>
                <article>
                  <span><Target size={19} /></span>
                  <div><h3>Suivi de tes objectifs</h3><p>Garde une vue claire sur ton parcours et les prochaines étapes.</p></div>
                </article>
              </div>
              <div className="dashboard-vip-availability">
                <span><CheckCircle2 size={17} /></span>
                <p>L’abonnement VIP et le paiement en ligne ne sont pas encore activés sur cette version de LearnSpace.</p>
              </div>
              <button className="dashboard-vip-contact" type="button" onClick={() => setActiveMenu("Contact")}>
                Contacter l’équipe pour en savoir plus <ArrowRight size={16} />
              </button>
            </div>

            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Notifications" ? (
          <section className="dashboard-notifications">
            <header className="dashboard-notifications-header">
              <span className="dashboard-notifications-eyebrow"><Bell size={16} /> TON ESPACE ÉTUDIANT</span>
              <h1>Notifications</h1>
              <p>Retrouve ici le suivi de tes objectifs et les dernières informations sur ton apprentissage.</p>
            </header>

            <div className="notification-overview">
              <article className="notification-overview-card">
                <span className="notification-overview-icon"><Target size={19} /></span>
                <div><strong>{completedStudyTasks.length}/{studyTasks.length}</strong><small>Objectifs du jour</small></div>
              </article>
              <article className="notification-overview-card">
                <span className="notification-overview-icon"><BookOpen size={19} /></span>
                <div><strong>{totalCompletedChapters}</strong><small>Chapitres terminés</small></div>
              </article>
              <article className="notification-overview-card">
                <span className="notification-overview-icon"><Award size={19} /></span>
                <div><strong>{recentQuizResults.length}</strong><small>Quiz récents</small></div>
              </article>
            </div>

            <div className="notification-feed">
              <article className="notification-item">
                <span className="notification-item-icon"><Target size={19} /></span>
                <div className="notification-item-content">
                  <div className="notification-item-heading">
                    <h2>Ton plan d’étude du jour</h2>
                    <span className="notification-item-badge">Aujourd’hui</span>
                  </div>
                  <p>
                    {completedStudyTasks.length === studyTasks.length
                      ? "Bravo, tu as terminé tous tes objectifs du jour."
                      : `Tu as terminé ${completedStudyTasks.length} objectif(s) sur ${studyTasks.length}. Continue pour garder le rythme.`}
                  </p>
                  <button type="button" className="notification-item-link" onClick={() => setActiveMenu("Centre d'étude")}>
                    Voir mon plan <ArrowRight size={14} />
                  </button>
                </div>
              </article>

              {coursesInProgress.length > 0 ? (
                coursesInProgress.map((course) => {
                  const progress = getCourseProgress(course.id, course);
                  const chapter = getCourseResumeChapter(course);
                  return (
                    <article className="notification-item" key={course.id}>
                      <span className="notification-item-icon"><BookOpen size={19} /></span>
                      <div className="notification-item-content">
                        <div className="notification-item-heading">
                          <h2>Formation à reprendre</h2>
                          <span className="notification-item-badge">{progress}%</span>
                        </div>
                        <p><strong>{course.title}</strong> — tu peux reprendre avec « {chapter.title} ».</p>
                        <Link className="notification-item-link" to={`/formations/${course.id}/cours/${chapter.id}`}>
                          Reprendre le cours <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  );
                })
              ) : (
                <article className="notification-item">
                  <span className="notification-item-icon"><BookOpen size={19} /></span>
                  <div className="notification-item-content">
                    <div className="notification-item-heading"><h2>Découvre les formations</h2></div>
                    <p>Commence une formation pour suivre ici ta progression et retrouver facilement tes cours en cours.</p>
                    <Link className="notification-item-link" to="/formations">Parcourir le catalogue <ArrowRight size={14} /></Link>
                  </div>
                </article>
              )}

              {recentQuizResults.length > 0 ? (
                <article className="notification-item">
                  <span className="notification-item-icon"><Award size={19} /></span>
                  <div className="notification-item-content">
                    <div className="notification-item-heading">
                      <h2>Derniers résultats de quiz</h2>
                      <span className="notification-item-badge">{recentQuizResults.length} résultat(s)</span>
                    </div>
                    <ul className="notification-quiz-list">
                      {recentQuizResults.map((result, index) => (
                        <li key={`${result.courseId}-${result.date}-${index}`}>
                          <span>{result.courseTitle}</span>
                          <strong>{result.score}% <small>({result.correct}/{result.total})</small></strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ) : (
                <article className="notification-item">
                  <span className="notification-item-icon"><Award size={19} /></span>
                  <div className="notification-item-content">
                    <div className="notification-item-heading"><h2>Ton prochain quiz</h2></div>
                    <p>Les résultats de tes quiz apparaîtront ici après ta première évaluation de formation.</p>
                    <Link className="notification-item-link" to="/formations">Choisir une formation <ArrowRight size={14} /></Link>
                  </div>
                </article>
              )}
            </div>

            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Contact" ? (
          <section className="dashboard-contact-section">
            <header className="dashboard-contact-header">
              <span className="dashboard-contact-eyebrow"><Mail size={16} /> CONTACT LEARNSPACE</span>
              <h1>Comment pouvons-nous t’aider ?</h1>
              <p>Envoie-nous ta question. Ton application de messagerie préparera un courriel à notre équipe.</p>
            </header>

            <div className="dashboard-contact-grid">
              <aside className="dashboard-contact-info">
                <span className="dashboard-contact-icon"><Mail size={22} /></span>
                <h2>Restons en contact</h2>
                <p>Notre équipe est disponible pour répondre à tes questions sur les formations et ton espace étudiant.</p>
                <a href="mailto:husseindiallo65@gmail.com">husseindiallo65@gmail.com</a>
                <div className="dashboard-contact-response"><Clock3 size={16} /> Nous te répondrons dans les plus brefs délais.</div>
              </aside>

              <form className="dashboard-contact-form" onSubmit={handleDashboardContactSubmit}>
                <h2>Écris-nous un message</h2>
                <label>
                  Nom
                  <input name="name" type="text" autoComplete="name" placeholder="Ton nom" required />
                </label>
                <label>
                  Adresse e-mail
                  <input name="email" type="email" autoComplete="email" placeholder="toi@exemple.com" required />
                </label>
                <label>
                  Message
                  <textarea name="message" rows="5" placeholder="Comment pouvons-nous t’aider ?" required />
                </label>
                {dashboardContactNotice && <p className="dashboard-contact-notice" role="status">{dashboardContactNotice}</p>}
                <button className="dashboard-contact-submit" type="submit">Préparer le courriel <ArrowRight size={16} /></button>
              </form>
            </div>
          </section>
        ) : activeMenu === "Vocabulaire" ? (
          <section className="vocabulary-section">
            <header className="vocabulary-header">
              <span className="study-center-eyebrow"><BookMarked size={16} /> APPRENDS UN MOT À LA FOIS</span>
              <h1>Vocabulaire anglais</h1>
              <p>Découvre de nouveaux mots, mémorise-les avec des exemples et teste tes connaissances.</p>
            </header>

            <div className="vocabulary-categories" aria-label="Catégories de vocabulaire">
              {vocabularyCategories.map((category) => (
                <button
                  className={`vocabulary-category ${vocabularyCategory === category ? "active" : ""}`}
                  key={category}
                  type="button"
                  aria-pressed={vocabularyCategory === category}
                  onClick={() => selectVocabularyCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="vocabulary-grid">
              <section className="vocabulary-card-panel" aria-labelledby="vocabulary-card-title">
                <div className="vocabulary-panel-heading">
                  <div>
                    <span className="study-section-eyebrow">FICHE DE VOCABULAIRE</span>
                    <h2 id="vocabulary-card-title">À mémoriser</h2>
                  </div>
                  <span className="vocabulary-position">{vocabularyIndex + 1} / {filteredVocabulary.length}</span>
                </div>
                {currentVocabulary && (
                  <article className="vocabulary-flashcard">
                    <span className="vocabulary-word-category">{currentVocabulary.category}</span>
                    <h3>{currentVocabulary.word}</h3>
                    {showVocabularyTranslation ? (
                      <div className="vocabulary-translation">
                        <strong>{currentVocabulary.translation}</strong>
                        <p>{currentVocabulary.example}</p>
                      </div>
                    ) : (
                      <p className="vocabulary-hint">Essaie de deviner le sens avant de révéler la réponse.</p>
                    )}
                    <button
                      className="vocabulary-reveal-button"
                      type="button"
                      onClick={() => setShowVocabularyTranslation((show) => !show)}
                    >
                      {showVocabularyTranslation ? "Masquer la réponse" : "Afficher la traduction"}
                    </button>
                  </article>
                )}
                <div className="vocabulary-card-navigation">
                  <button
                    type="button"
                    disabled={vocabularyIndex === 0}
                    onClick={() => { setVocabularyIndex((index) => index - 1); setShowVocabularyTranslation(false); }}
                  >
                    <ChevronLeft size={16} /> Précédent
                  </button>
                  <button
                    type="button"
                    disabled={vocabularyIndex === filteredVocabulary.length - 1}
                    onClick={() => { setVocabularyIndex((index) => index + 1); setShowVocabularyTranslation(false); }}
                  >
                    Suivant <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              <section className="vocabulary-quiz-panel" aria-labelledby="vocabulary-quiz-title">
                <div className="vocabulary-panel-heading">
                  <div>
                    <span className="study-section-eyebrow">RÉVISION RAPIDE</span>
                    <h2 id="vocabulary-quiz-title">Quiz de vocabulaire</h2>
                  </div>
                  {!vocabularyQuizComplete && (
                    <span className="vocabulary-position">{vocabularyQuizIndex + 1} / {filteredVocabulary.length}</span>
                  )}
                </div>
                {vocabularyQuizComplete ? (
                  <div className="vocabulary-quiz-result" role="status">
                    <Award size={30} />
                    <h3>Quiz terminé !</h3>
                    <p>Tu as trouvé {vocabularyQuizScore} bonne(s) réponse(s) sur {filteredVocabulary.length}.</p>
                    <button className="vocabulary-reveal-button" type="button" onClick={restartVocabularyQuiz}>
                      <RotateCcw size={15} /> Recommencer
                    </button>
                  </div>
                ) : currentVocabularyQuizItem && (
                  <div className="vocabulary-quiz-content">
                    <p>Que signifie ce mot ?</p>
                    <h3>{currentVocabularyQuizItem.word}</h3>
                    <div className="vocabulary-quiz-options">
                      {currentVocabularyQuizItem.choices.map((choice) => {
                        const isCorrect = choice === currentVocabularyQuizItem.translation;
                        const isSelected = vocabularyQuizAnswer === choice;
                        return (
                          <button
                            className={`vocabulary-quiz-option ${vocabularyQuizAnswer && isCorrect ? "correct" : ""} ${isSelected && !isCorrect ? "incorrect" : ""}`}
                            type="button"
                            key={choice}
                            disabled={Boolean(vocabularyQuizAnswer)}
                            onClick={() => answerVocabularyQuiz(choice)}
                          >
                            {choice}
                            {vocabularyQuizAnswer && isCorrect && <CheckCircle2 size={16} />}
                          </button>
                        );
                      })}
                    </div>
                    {vocabularyQuizAnswer && (
                      <button className="vocabulary-reveal-button vocabulary-next-question" type="button" onClick={nextVocabularyQuizQuestion}>
                        {vocabularyQuizIndex === filteredVocabulary.length - 1 ? "Voir mon score" : "Question suivante"}
                        <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                )}
              </section>
            </div>

            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Centre d'étude" ? (
          <section className="study-center">
            <header className="study-center-header">
              <span className="study-center-eyebrow"><BookOpen size={16} /> TON ESPACE D’APPRENTISSAGE</span>
              <h1>Centre d’étude</h1>
              <p>Reprends une formation et avance pas à pas vers tes objectifs.</p>
            </header>

            <div className="study-center-grid">
              <section className="study-plan-card" aria-labelledby="study-plan-title">
                <div className="study-plan-heading">
                  <div className="study-plan-icon"><Target size={20} /></div>
                  <div>
                    <h2 id="study-plan-title">Mon plan du jour</h2>
                    <p>De petites étapes régulières font la différence.</p>
                  </div>
                  <span className="study-plan-progress">{completedStudyTasks.length}/{studyTasks.length}</span>
                </div>
                <div className="study-plan-track" aria-label={`${completedStudyTasks.length} tâche(s) terminée(s) sur ${studyTasks.length}`}>
                  <span style={{ width: `${(completedStudyTasks.length / studyTasks.length) * 100}%` }} />
                </div>
                <div className="study-task-list">
                  {studyTasks.map((task) => {
                    const checked = completedStudyTasks.includes(task.id);
                    return (
                      <label className={`study-task ${checked ? "completed" : ""}`} key={task.id}>
                        <input type="checkbox" checked={checked} onChange={() => toggleStudyTask(task.id)} />
                        <span className="study-task-copy">
                          <strong>{task.label}</strong>
                          <small>{task.detail}</small>
                        </span>
                        {checked && <CheckCircle2 size={18} aria-label="Terminé" />}
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="study-courses" aria-labelledby="study-courses-title">
                <div className="study-section-heading">
                  <div>
                    <span className="study-section-eyebrow">CONTINUE À APPRENDRE</span>
                    <h2 id="study-courses-title">Tes formations</h2>
                  </div>
                  <Link to="/formations">Tout le catalogue <ArrowRight size={15} /></Link>
                </div>
                <div className="study-course-list">
                  {courses.map((course) => {
                    const progress = getCourseProgress(course.id, course);
                    const chapter = getCourseResumeChapter(course);
                    const CourseIcon = studyCourseIcons[course.category] || BookOpen;
                    const chapterUrl = `/formations/${course.id}/cours/${chapter.id}`;
                    return (
                      <article className="study-course-card" key={course.id}>
                        <div className={`study-course-icon art-${course.color}`} aria-hidden="true">
                          <CourseIcon size={21} strokeWidth={1.8} />
                        </div>
                        <div className="study-course-info">
                          <div className="study-course-meta">
                            <span>{course.category}</span>
                            <span>{progress === 100 ? "Terminée" : `${progress}% complété`}</span>
                          </div>
                          <h3>{course.title}</h3>
                          <div className="study-course-track" aria-label={`Progression : ${progress}%`}>
                            <span style={{ width: `${progress}%` }} />
                          </div>
                          <Link className="study-course-action" to={chapterUrl}>
                            {progress > 0 && progress < 100 ? "Reprendre" : progress === 100 ? "Revoir la formation" : "Commencer"} <ArrowRight size={14} />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>

            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Tests blancs" ? (
          <section className="level-test-section">
            <header className="settings-header">
              <span className="level-test-eyebrow"><ClipboardCheck size={16} /> ÉVALUATION PERSONNELLE</span>
              <h1>Test de niveau d’anglais</h1>
              <p>Évalue tes bases en anglais et découvre le niveau à travailler en priorité.</p>
            </header>

            <article className="level-test-card">
              <div className="level-test-intro">
                <div>
                  <h2>Prêt à commencer ?</h2>
                  <p>6 questions · environ 5 minutes · une seule réponse par question</p>
                </div>
                <span className="level-test-count">{levelTestQuestions.length} questions</span>
              </div>

              {levelTestResult ? (
                <div className="level-test-result" role="status">
                  <span className="level-test-result-icon"><Award size={28} /></span>
                  <p className="level-test-result-label">Ton niveau estimé</p>
                  <h2>{levelTestResult.level}</h2>
                  <p>Tu as obtenu {levelTestResult.correct} bonnes réponses sur {levelTestResult.total} ({levelTestResult.percentage}%).</p>
                  <button className="level-test-submit" type="button" onClick={restartLevelTest}>
                    <RotateCcw size={16} /> Recommencer le test
                  </button>
                </div>
              ) : (
                <form className="level-test-form" onSubmit={submitLevelTest}>
                  {levelTestQuestions.map((item, index) => (
                    <fieldset className="level-test-question" key={item.question}>
                      <legend><span>{String(index + 1).padStart(2, "0")}</span>{item.question}</legend>
                      <div className="level-test-options">
                        {item.options.map((option, optionIndex) => (
                          <label className="level-test-option" key={option}>
                            <input
                              type="radio"
                              name={`level-question-${index}`}
                              value={optionIndex}
                              checked={String(levelTestAnswers[index]) === String(optionIndex)}
                              onChange={() => setLevelTestAnswers((answers) => ({ ...answers, [index]: optionIndex }))}
                              required
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  <button className="level-test-submit" type="submit">Voir mon résultat <ArrowRight size={17} /></button>
                </form>
              )}
            </article>
          </section>
        ) : activeMenu === "Aide (Q&R)" ? (
          <section className="settings-section">
            <div className="settings-header">
              <h1>Aide & Questions Fréquentes</h1>
              <p>Trouve des réponses à tes questions ou contacte-nous</p>
            </div>
            
            <div className="settings-grid">
              <article className="settings-card" style={{ gridColumn: '1 / -1' }}>
                <div className="settings-card-header">
                  <CircleHelp size={22} />
                  <h2>Questions fréquentes</h2>
                </div>
                <div className="settings-info-list">
                  <div className="settings-info-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <span className="settings-label" style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>Comment accéder aux formations ?</span>
                    <span className="settings-value" style={{ fontWeight: '400', color: '#6b7280' }}>Va dans "Formations" depuis le menu principal ou connecte-toi pour accéder au contenu protégé.</span>
                  </div>
                  <div className="settings-info-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <span className="settings-label" style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>Comment suivre ma progression ?</span>
                    <span className="settings-value" style={{ fontWeight: '400', color: '#6b7280' }}>Ta progression est automatiquement sauvegardée dans ton navigateur quand tu marques un chapitre comme terminé.</span>
                  </div>
                  <div className="settings-info-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <span className="settings-label" style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>Comment obtenir mon certificat ?</span>
                    <span className="settings-value" style={{ fontWeight: '400', color: '#6b7280' }}>Termine tous les chapitres d'une formation à 100% pour débloquer ton certificat simulé.</span>
                  </div>
                  <div className="settings-info-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <span className="settings-label" style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>Le compte est-il sécurisé ?</span>
                    <span className="settings-value" style={{ fontWeight: '400', color: '#6b7280' }}>Il s'agit d'une authentification de démonstration stockée localement dans ton navigateur.</span>
                  </div>
                </div>
              </article>

              <article className="settings-card">
                <div className="settings-card-header">
                  <Mail size={22} />
                  <h2>Nous contacter</h2>
                </div>
                <p className="settings-danger-text" style={{ color: '#6b7280' }}>Besoin d'aide supplémentaire ? Envoie-nous un message.</p>
                <button className="settings-action-btn" onClick={() => { navigate("/"); setTimeout(() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 150); }}>
                  Aller au formulaire de contact
                </button>
              </article>

              <article className="settings-card">
                <div className="settings-card-header">
                  <BookOpen size={22} />
                  <h2>Ressources</h2>
                </div>
                <div className="settings-info-list">
                  <button className="settings-action-btn" onClick={() => navigate("/formations")} style={{ textAlign: 'left' }}>Catalogue des formations</button>
                  <button className="settings-action-btn" onClick={() => navigate("/profil")} style={{ textAlign: 'left' }}>Mon profil</button>
                </div>
              </article>
            </div>

            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Paramètres" ? (
          <section className="settings-section">
            <div className="settings-header">
              <h1>Paramètres</h1>
              <p>Gère ton compte et tes préférences</p>
            </div>
            
            <div className="settings-grid">
              <article className="settings-card">
                <div className="settings-card-header">
                  <User size={22} />
                  <h2>Informations du compte</h2>
                </div>
                <div className="settings-info-list">
                  <div className="settings-info-item">
                    <span className="settings-label">Prénom</span>
                    <span className="settings-value">{profile.firstName || "Non renseigné"}</span>
                  </div>
                  <div className="settings-info-item">
                    <span className="settings-label">Nom</span>
                    <span className="settings-value">{profile.lastName || "Non renseigné"}</span>
                  </div>
                  <div className="settings-info-item">
                    <span className="settings-label">Email</span>
                    <span className="settings-value">{profile.email || "Non renseigné"}</span>
                  </div>
                  <div className="settings-info-item">
                    <span className="settings-label">Téléphone</span>
                    <span className="settings-value">{profile.phone || "Non renseigné"}</span>
                  </div>
                </div>
                <button className="settings-action-btn" onClick={() => navigate("/profil")}>
                  Modifier le profil
                </button>
              </article>

              <article className="settings-card">
                <div className="settings-card-header">
                  <Globe size={22} />
                  <h2>Préférences</h2>
                </div>
                <div className="settings-info-list">
                  <div className="settings-info-item">
                    <span className="settings-label">Langue</span>
                    <span className="settings-value">Français</span>
                  </div>
                  <div className="settings-info-item">
                    <span className="settings-label">Fuseau horaire</span>
                    <span className="settings-value">UTC+0 (GMT)</span>
                  </div>
                </div>
              </article>

              <article className="settings-card">
                <div className="settings-card-header">
                  <Shield size={22} />
                  <h2>Sécurité</h2>
                </div>
                <div className="settings-info-list">
                  <div className="settings-info-item">
                    <span className="settings-label">Mot de passe</span>
                    <span className="settings-value">••••••••</span>
                  </div>
                  <div className="settings-info-item">
                    <span className="settings-label">Authentification</span>
                    <span className="settings-value">Compte local (démo)</span>
                  </div>
                </div>
              </article>

              <article className="settings-card settings-danger">
                <div className="settings-card-header">
                  <LogOut size={22} />
                  <h2>Session</h2>
                </div>
                <p className="settings-danger-text">Se déconnecter de ton compte LearnSpace</p>
                <button className="settings-logout-btn" onClick={() => { logoutDemoAccount(); navigate("/connexion"); }}>
                  Se déconnecter
                </button>
              </article>
            </div>

            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : (
        <>
        <section className="hero-banner">
          <img key={currentBanner.image} className="hero-image" src={currentBanner.image} alt="Étudiants en formation" />
          <div className="hero-shade" />
          <button className="banner-arrow banner-prev" onClick={previousBanner} aria-label="Bannière précédente"><ChevronLeft size={25} /></button>
          <div className="hero-card">
            <span className="hero-label">BIENVENUE SUR LEARNSPACE</span>
            <h1>{currentBanner.title}</h1>
            <p>{currentBanner.subtitle}</p>
              <button className="primary-button" onClick={() => navigate("/formations")}>{currentBanner.button} <ArrowRight size={15} /></button>
          </div>
          <button className="banner-arrow banner-next" onClick={nextBanner} aria-label="Bannière suivante"><ChevronRight size={25} /></button>
        </section>

        <section className="statistics-grid">
          <article className="stat-card study-card">
            <div className="card-heading">
              <div>
                <h2>Statistiques d'étude</h2>
                <p>Date d'examen : 2026-12-28</p>
              </div>
              <span className="date-pill">21 jours restants ›</span>
            </div>
            <div className="stats-values">
              <div><strong>0</strong><span>Aujourd'hui</span></div>
              <div><strong>1</strong><span>Total pratiqué</span></div>
              <div><strong>1</strong><span>Jours de préparation</span></div>
            </div>
          </article>
          <article className="stat-card prediction-card" id="predictions">
            <div className="card-heading">
              <div>
                <h2>Prévision hebdomadaire</h2>
                <p>Semaine : 0801 - 0808</p>
              </div>
              <button className="download-button">Télécharger <Download size={14} /></button>
            </div>
            <div className="stats-values prediction-values">
              <div><strong>67%</strong><span>À répéter</span></div>
              <div><strong>69</strong><span>Nouveau</span></div>
              <div><strong>1514</strong><span>Prévision</span></div>
              <div><strong>88</strong><span>Mise à jour</span></div>
            </div>
          </article>
        </section>

        <section className="resource-grid">
          {resources.map(({ title, subtitle, icon: Icon }) => (
            <button className="resource-card" key={title} onClick={() => setActiveMenu(title)}>
              <span className="resource-icon"><Icon size={19} /></span>
              <span className="resource-text"><strong>{title}</strong><small>{subtitle}</small></span>
              <ChevronRight className="resource-arrow" size={17} />
            </button>
          ))}
        </section>

        <section className="lesson-grid">
          {lessons.map((lesson) => (
            <button className="lesson-card" key={lesson.title} onClick={() => setActiveMenu(lesson.title)}>
              <img src={lesson.image} alt="" loading="lazy" />
              <span className="lesson-overlay" />
              <strong>{lesson.title}</strong>
              <ChevronRight size={14} />
            </button>
          ))}
        </section>

        <section className="bottom-cards">
          <article className="join-card exam-card">
            <div className="join-icon"><Target size={24} /></div>
            <div className="join-description">
              <h2>Centre d'examen PTE</h2>
              <p>Derniers souvenirs d'examen</p>
            </div>
            <button onClick={() => { navigate("/"); setTimeout(() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 150); }}>Rejoindre <ArrowRight size={15} /></button>
          </article>
          <article className="join-card group-card">
            <div className="join-icon"><CheckCircle2 size={24} /></div>
            <div className="join-description">
              <h2>Rejoindre notre groupe</h2>
              <p>Apprends et échange avec nous</p>
            </div>
            <button onClick={() => { navigate("/"); setTimeout(() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 150); }}>Rejoindre <ArrowRight size={15} /></button>
          </article>
        </section>

        <section className="dashboard-socials" id="socials">
          <div className="dashboard-socials-content">
            <div>
              <h2>Suivez-nous</h2>
              <p>Restez connecté avec LearnSpace</p>
            </div>
            <div className="dashboard-socials-links">
              <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><img src={instagramIcon} alt="Instagram" /></a>
              <a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><img src={youtubeIcon} alt="YouTube" /></a>
              <a href="https://www.linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><img src={linkedinIcon} alt="LinkedIn" /></a>
              <a href="https://www.tiktok.com/" aria-label="TikTok" target="_blank" rel="noopener noreferrer"><img src={tiktokIcon} alt="TikTok" /></a>
            </div>
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>LearnSpace © 2026</span>
          <span>Apprendre aujourd'hui. Réussir demain.</span>
        </footer>
        </>
        )}
      </main>
    </div>
  );
}
