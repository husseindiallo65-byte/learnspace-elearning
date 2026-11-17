import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard.jsx";
import { getCategories, getCatalogCourses, getAllChapters } from "../../data/courses.js";
import Quiz from "../../components/Quiz.jsx";
import CourseHub from "../../components/CourseHub.jsx";
import { getCourseProgress, getProfile, getProgress, getQuizResults, getStudyPlan, saveProfile, saveStudyPlan } from "../../utils/storage.js";
import { logoutDemoAccount } from "../../utils/demoAuth.js";
import instagramIcon from "../../assets/social/instagram.png";
import youtubeIcon from "../../assets/social/youtube.png";
import linkedinIcon from "../../assets/social/linkedin.png";
import tiktokIcon from "../../assets/social/tiktok.png";
import {
  BookOpen, LayoutDashboard, GraduationCap, BookMarked,
  Settings, Star, Bell, CircleHelp, LogOut, ChevronDown,
  ChevronLeft, ChevronRight, FileText, Mic,
  Brain, Monitor, Download, ArrowRight, Menu, ClipboardCheck, Briefcase,
  X, Flame, Target, CheckCircle2, UserRound, Globe, Moon, Shield, Mail, Award, RotateCcw, Clock3, Headset, Sprout
} from "lucide-react";
import courseReactImg from "../../assets/course-react.webp";
import courseDesignImg from "../../assets/course-design.webp";
import courseMarketingImg from "../../assets/course-marketing.webp";
import courseOfficeImg from "../../assets/course-office.webp";
import "./Dashboard.css";

const menuItems = [
  { label: "Tableau de bord", icon: LayoutDashboard },
  { label: "Centre d'étude", icon: BookOpen },
  { label: "Cours", icon: GraduationCap },
  { label: "Actualités", icon: Bell },
  { label: "Quiz", icon: ClipboardCheck },
  { label: "Ressources", icon: BookMarked },
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
];

const speakingExercises = [
  {
    title: "Read Aloud",
    duration: "30 à 40 secondes",
    instruction: "Lis le passage à voix haute, clairement et sans t’arrêter entre les groupes de mots.",
    prompt: "Many students choose to study online because digital courses offer flexibility and access to a wide range of learning resources.",
  },
];

const writingExercises = [];

const readingExercises = [
  {
    title: "Urban Gardens",
    duration: "3 questions",
    passage: "Community gardens are becoming increasingly popular in many cities. They provide residents with a place to grow fresh food and learn about sustainable agriculture. These gardens can also bring neighbours together, although they require volunteers to maintain them throughout the year.",
    questions: [
      { question: "What is one benefit of community gardens mentioned in the passage?", options: ["They provide fresh food.", "They reduce public transport costs.", "They create new roads."], answer: 0 },
      { question: "How can these gardens help a neighbourhood?", options: ["By bringing neighbours together.", "By replacing local schools.", "By providing office space."], answer: 0 },
      { question: "What do the gardens need throughout the year?", options: ["More parking spaces.", "Volunteers to maintain them.", "A larger supermarket."], answer: 1 },
    ],
  },
  {
    title: "Learning a Language",
    duration: "3 questions",
    passage: "Learning a new language takes regular practice. Short daily study sessions can help learners remember vocabulary more effectively than studying for many hours only once a week. Listening to podcasts and speaking with others also gives students the chance to use new expressions in context.",
    questions: [
      { question: "According to the passage, what can help learners remember vocabulary?", options: ["Short daily study sessions.", "Studying only once a month.", "Avoiding new expressions."], answer: 0 },
      { question: "What is one way to use new expressions in context?", options: ["Listening to podcasts and speaking with others.", "Reading only word lists.", "Translating every sentence."], answer: 0 },
      { question: "How often does the passage recommend practising?", options: ["Regularly, in short sessions.", "Only before an exam.", "For many hours once a week."], answer: 0 },
    ],
  },
  {
    title: "Public Transport",
    duration: "3 questions",
    passage: "A city transport survey found that commuters who used the new express bus saved an average of fifteen minutes on their journey. The service runs every ten minutes during rush hour. Some passengers requested more weekend services, but the transport authority said it would review demand before making changes.",
    questions: [
      { question: "How much time did express-bus commuters save on average?", options: ["Ten minutes.", "Fifteen minutes.", "Thirty minutes."], answer: 1 },
      { question: "How often does the bus run during rush hour?", options: ["Every ten minutes.", "Every fifteen minutes.", "Once an hour."], answer: 0 },
      { question: "What will the transport authority do before making changes?", options: ["Review demand.", "Cancel the service.", "Increase ticket prices."], answer: 0 },
    ],
  },
];

const listeningExercises = [
  {
    title: "A Library Announcement",
    duration: "3 questions",
    transcript: "Attention students. The main library will close at six p.m. this Friday for essential maintenance. The study rooms on the second floor will remain open until eight p.m. Please return borrowed books to the front desk before leaving.",
    questions: [
      { question: "Why will the main library close early on Friday?", options: ["For essential maintenance.", "Because of a public holiday.", "For a student meeting."], answer: 0 },
      { question: "Which area will stay open until eight p.m.?", options: ["The café.", "The study rooms on the second floor.", "The front desk."], answer: 1 },
      { question: "Where should students return borrowed books?", options: ["At the front desk.", "In the study rooms.", "At the main entrance."], answer: 0 },
    ],
  },
  {
    title: "Booking a Course",
    duration: "3 questions",
    transcript: "Hello, I would like to enrol in the evening photography course. I saw that classes begin on the twelfth of May and take place every Tuesday. Could you tell me whether the course fee includes the camera equipment?",
    questions: [
      { question: "Which course does the speaker want to join?", options: ["A morning art course.", "An evening photography course.", "A weekend writing course."], answer: 1 },
      { question: "When do the classes begin?", options: ["On the twelfth of May.", "On the twentieth of May.", "On the second of June."], answer: 0 },
      { question: "What does the speaker want to know about the fee?", options: ["Whether it includes camera equipment.", "Whether it can be paid in cash.", "Whether it covers travel."], answer: 0 },
    ],
  },
  {
    title: "Weather Report",
    duration: "3 questions",
    transcript: "Tomorrow will begin with clear skies and cool temperatures. Rain is expected in the west after midday and may continue into the evening. People travelling by car should allow extra time, as roads could become slippery during the afternoon.",
    questions: [
      { question: "What will the weather be like in the morning?", options: ["Clear and cool.", "Windy and warm.", "Rainy throughout the region."], answer: 0 },
      { question: "When is rain expected in the west?", options: ["Before sunrise.", "After midday.", "Late at night only."], answer: 1 },
      { question: "What should drivers do?", options: ["Allow extra time.", "Avoid travelling in the morning.", "Use public parks."], answer: 0 },
    ],
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
  "Entrepreneuriat & Business": Briefcase,
  "Relation client": Headset,
  "Développement personnel": Sprout,
};

function getLocalDateKey() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export default function TeacherDashboard() {
  const courses = getCatalogCourses();
  const [profile, setProfile] = useState(() => getProfile());
  const location = useLocation();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(location.state?.dashboardSection === "Cours" ? "Cours" : "Tableau de bord");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [levelTestAnswers, setLevelTestAnswers] = useState({});
  const [levelTestResult, setLevelTestResult] = useState(null);
  const [studyDate] = useState(getLocalDateKey);
  const [completedStudyTasks, setCompletedStudyTasks] = useState(() => getStudyPlan(getLocalDateKey()));
  const [banner, setBanner] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSpeakingExercise, setSelectedSpeakingExercise] = useState(0);
  const [completedSpeakingExercises, setCompletedSpeakingExercises] = useState([]);
  const [selectedWritingExercise, setSelectedWritingExercise] = useState(0);
  const [writingResponse, setWritingResponse] = useState("");
  const [writingFeedback, setWritingFeedback] = useState("");
  const [selectedReadingExercise, setSelectedReadingExercise] = useState(0);
  const [readingAnswers, setReadingAnswers] = useState({});
  const [readingResult, setReadingResult] = useState(null);
  const [selectedListeningExercise, setSelectedListeningExercise] = useState(0);
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [listeningResult, setListeningResult] = useState(null);
  const [isListeningAudioPlaying, setIsListeningAudioPlaying] = useState(false);
  const [listeningAudioNotice, setListeningAudioNotice] = useState("");
  const [dashboardContactNotice, setDashboardContactNotice] = useState("");
  const [vocabularyCategory, setVocabularyCategory] = useState("Tout");
  const [vocabularyIndex, setVocabularyIndex] = useState(0);
  const [showVocabularyTranslation, setShowVocabularyTranslation] = useState(false);
  const [vocabularyQuizIndex, setVocabularyQuizIndex] = useState(0);
  const [vocabularyQuizAnswer, setVocabularyQuizAnswer] = useState("");
  const [vocabularyQuizScore, setVocabularyQuizScore] = useState(0);
  const [vocabularyQuizComplete, setVocabularyQuizComplete] = useState(false);

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
    const current = vocabularyCategories.length > 0
      ? vocabularyWords.filter((w) => vocabularyCategory === "Tout" || w.category === vocabularyCategory)[vocabularyQuizIndex]
      : null;
    if (vocabularyQuizAnswer || !current) return;
    setVocabularyQuizAnswer(choice);
    if (choice === current.translation) {
      setVocabularyQuizScore((score) => score + 1);
    }
  };

  const nextVocabularyQuizQuestion = () => {
    const filtered = vocabularyWords.filter((w) => vocabularyCategory === "Tout" || w.category === vocabularyCategory);
    if (vocabularyQuizIndex === filtered.length - 1) {
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

  const checkWritingResponse = () => {
    const exercise = writingExercises[selectedWritingExercise];
    const wordCount = writingResponse.trim() ? writingResponse.trim().split(/\s+/).length : 0;
    if (wordCount < exercise.wordLimit.min) {
      setWritingFeedback(`Ton texte contient ${wordCount} mot(s). Ajoute du contenu pour atteindre au moins ${exercise.wordLimit.min} mots.`);
    } else if (wordCount > exercise.wordLimit.max) {
      setWritingFeedback(`Ton texte contient ${wordCount} mots. Réduis-le à ${exercise.wordLimit.max} mots maximum.`);
    } else {
      setWritingFeedback(`La longueur est conforme : ${wordCount} mot(s). Relis ton texte pour vérifier la grammaire et la clarté.`);
    }
  };

  const submitComprehensionQuiz = (event, questions, answers, setResult) => {
    event.preventDefault();
    const correct = questions.reduce(
      (total, question, index) => total + (Number(answers[index]) === question.answer ? 1 : 0),
      0,
    );
    setResult({ correct, total: questions.length });
  };

  const playListeningExercise = () => {
    if (!("speechSynthesis" in window)) {
      setListeningAudioNotice("La lecture audio n’est pas disponible dans ce navigateur.");
      return;
    }
    if (isListeningAudioPlaying) {
      window.speechSynthesis.cancel();
      setIsListeningAudioPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(listeningExercises[selectedListeningExercise].transcript);
    utterance.lang = "en-US";
    utterance.onend = () => setIsListeningAudioPlaying(false);
    utterance.onerror = () => {
      setIsListeningAudioPlaying(false);
      setListeningAudioNotice("La lecture audio a échoué. Réessaie ou vérifie les paramètres audio de ton navigateur.");
    };
    setListeningAudioNotice("");
    setIsListeningAudioPlaying(true);
    window.speechSynthesis.speak(utterance);
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

  const progressByCourse = courses.reduce((acc, course) => {
    acc[course.id] = getCourseProgress(course.id, course);
    return acc;
  }, {});

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
            <button key={label} className={`sidebar-link ${activeMenu === label ? "active" : ""}`} onClick={() => {
              if (label === "Se déconnecter") {
                logoutDemoAccount();
                navigate("/connexion");
                return;
              }
              setActiveMenu(label);
              setSidebarOpen(false);
              if (label === "Paramètres" || label === "Aide (Q&R)" || label === "Contact" || label === "Quiz") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}>
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Flame size={18} />
            <span>Vous accompagnez vos apprenants !</span>
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
                <strong>Espace professeur</strong>
                <small>Bienvenue, {profile.firstName || "Professeur"}</small>
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
                  Pratique pédagogique <ChevronDown size={15} />
                </button>
                {practiceOpen && (
                  <div className="navbar-dropdown-menu">
                    {["Gérer les cours", "Rédiger un module", "Suivre les apprenants"].map((title) => (
                      <button key={title} type="button" onClick={() => { setActiveMenu(title); setPracticeOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                        {title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" className="navbar-link" onClick={() => { setActiveMenu("Cours"); setPracticeOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Cours & formations</button>
            </nav>

            <div className="navbar-actions">
              <button className="navbar-notification" type="button" aria-label="Notifications" onClick={() => { setActiveMenu("Actualités"); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <Bell size={19} />
                <span className="notification-dot" />
              </button>
              <div className="navbar-profile-wrapper">
                <label className="navbar-profile" title="Changer la photo de profil">
                  {profile.photo ? (
                    <img src={profile.photo} alt="" />
                  ) : (
                    <UserRound size={20} aria-hidden="true" />
                  )}
                  <input className="navbar-photo-input" type="file" accept="image/*" aria-label="Sélectionner une nouvelle photo de profil" onChange={handleProfilePhotoChange} />
                </label>
              </div>
              <div className="navbar-account-wrapper">
                <button className="navbar-mobile-toggle" type="button" aria-label={accountMenuOpen ? "Fermer le menu du compte" : "Ouvrir le menu du compte"} aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen((open) => !open)}>
                  {accountMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                {accountMenuOpen && (
                  <div className="navbar-account-menu">
                    <nav className="navbar-account-nav" aria-label="Navigation du tableau de bord">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenu("Cours");
                          setAccountMenuOpen(false);
                        }}
                      >
                        Cours
                      </button>
                    </nav>
                    <Link to="/profil" onClick={() => setAccountMenuOpen(false)}><UserRound size={16} /> Profil</Link>
                    <button type="button" onClick={() => { logoutDemoAccount(); navigate("/connexion"); }}><LogOut size={16} /> Déconnexion</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {activeMenu === "Tableau de bord" ? (
          <>
            <section className="hero-banner">
              <img key={currentBanner.image} className="hero-image" src={currentBanner.image} alt="Étudiants en formation" />
              <div className="hero-shade" />
              <button className="banner-arrow banner-prev" onClick={previousBanner} aria-label="Bannière précédente"><ChevronLeft size={25} /></button>
              <div className="hero-card">
                <span className="hero-label">BIENVENUE SUR L’ESPACE PROFESSEUR</span>
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
          </>
        ) : activeMenu === "Cours" ? (
          <CourseHub />
        ) : activeMenu === "Quiz" ? (
          <section className="dashboard-quiz-section">
            <header className="study-center-header">
              <span className="study-center-eyebrow"><ClipboardCheck size={16} /> GESTION DES ÉVALUATIONS</span>
              <h1>Plateforme e-learning</h1>
              <p>Réponds aux questions à choix unique ou multiple, valide tes réponses et consulte ton score.</p>
            </header>
            {courses[0] && <Quiz course={courses[0]} />}

            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Vocabulaire" ? (
          <section className="vocabulary-section">
            <header className="vocabulary-header">
              <span className="study-section-eyebrow"><BookMarked size={16} /> FICHE DE VOCABULAIRE</span>
              <h2 id="vocabulary-card-title">À mémoriser</h2>
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
                {filteredVocabulary[vocabularyIndex] && (
                  <article className="vocabulary-flashcard">
                    <span className="vocabulary-word-category">{filteredVocabulary[vocabularyIndex].category}</span>
                    <h3>{filteredVocabulary[vocabularyIndex].word}</h3>
                    {showVocabularyTranslation ? (
                      <div className="vocabulary-translation">
                        <strong>{filteredVocabulary[vocabularyIndex].translation}</strong>
                        <p>{filteredVocabulary[vocabularyIndex].example}</p>
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
                ) : filteredVocabulary[vocabularyQuizIndex] && (
                  <div className="vocabulary-quiz-content">
                    <p>Que signifie ce mot ?</p>
                    <h3>{filteredVocabulary[vocabularyQuizIndex].word}</h3>
                    <div className="vocabulary-quiz-options">
                      {filteredVocabulary[vocabularyQuizIndex].choices.map((choice) => {
                        const isCorrect = choice === filteredVocabulary[vocabularyQuizIndex].translation;
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
                    const chapter = getAllChapters(course).find((c) => ![]) || getAllChapters(course)[0];
                    const CourseIcon = studyCourseIcons[course.category] || BookOpen;
                    const chapterUrl = `/course/${course.id}?chapter=${chapter.id}`;
                    return (
                      <article className="study-course-card" key={course.id}>
                        <div className={`study-course-icon art-${course.color}`} aria-hidden="true">
                          <CourseIcon size={21} strokeWidth={1.8} />
                        </div>
                        <div className="study-course-info">
                          <h3>{course.title}</h3>
                          <p>{course.shortDescription}</p>
                          <span>{progress}% terminé</span>
                        </div>
                        <Link className="study-course-link" to={chapterUrl}>
                          Reprendre <ArrowRight size={14} />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          </section>
        ) : activeMenu === "Practice" ? (
          <section className="pte-practice-section">
            <header className="study-center-header">
              <span className="study-center-eyebrow"><ClipboardCheck size={16} /> PRATIQUE PÉDAGOGIQUE</span>
              <h1>Exercices pratiques</h1>
              <p>Entraîne-toi sur les différents types d’exercices pour consolider tes acquis.</p>
            </header>
            <div className="practice-exercise-grid writing-exercise-grid">
              {speakingExercises.map((ex, index) => (
                <button
                  className="practice-exercise-card"
                  key={index}
                  type="button"
                  onClick={() => setSelectedSpeakingExercise(index)}
                >
                  <span className="practice-exercise-number">{index + 1}</span>
                  <strong>{ex.title}</strong>
                  <small>{ex.duration}</small>
                </button>
              ))}
              {writingExercises.map((ex, index) => (
                <button
                  className="practice-exercise-card"
                  key={"w" + index}
                  type="button"
                  onClick={() => setSelectedWritingExercise(index)}
                >
                  <span className="practice-exercise-number">{index + 1}</span>
                  <strong>{ex.title}</strong>
                  <small>{ex.duration}</small>
                </button>
              ))}
              {readingExercises.map((ex, index) => (
                <button
                  className="practice-exercise-card"
                  key={"r" + index}
                  type="button"
                  onClick={() => setSelectedReadingExercise(index)}
                >
                  <span className="practice-exercise-number">{index + 1}</span>
                  <strong>{ex.title}</strong>
                  <small>{ex.duration}</small>
                </button>
              ))}
              {listeningExercises.map((ex, index) => (
                <button
                  className="practice-exercise-card"
                  key={"l" + index}
                  type="button"
                  onClick={() => setSelectedListeningExercise(index)}
                >
                  <span className="practice-exercise-number">{index + 1}</span>
                  <strong>{ex.title}</strong>
                  <small>{ex.duration}</small>
                </button>
              ))}
            </div>
            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Expression écrite" ? (
          <section className="pte-practice-section">
            <header className="study-center-header">
              <span className="study-center-eyebrow"><FileText size={16} /> EXPRESSION ÉCRITE</span>
              <h1>Écriture</h1>
              <p>Rédige un texte structuré selon les consignes de l’exercice choisi.</p>
            </header>
            <div className="writing-exercise-grid">
              {writingExercises.map((ex, index) => (
                <button
                  className="practice-exercise-card"
                  key={index}
                  type="button"
                  onClick={() => setSelectedWritingExercise(index)}
                >
                  <span className="practice-exercise-number">{index + 1}</span>
                  <strong>{ex.title}</strong>
                  <small>{ex.duration}</small>
                </button>
              ))}
            </div>
            {writingExercises[selectedWritingExercise] && (
              <div className="practice-prompt-card">
                <div className="practice-prompt-heading">
                  <div>
                    <h2>{writingExercises[selectedWritingExercise].title}</h2>
                    <span className="practice-duration">{writingExercises[selectedWritingExercise].duration}</span>
                  </div>
                </div>
                <p>{writingExercises[selectedWritingExercise].instruction}</p>
                <p>{writingExercises[selectedWritingExercise].prompt}</p>
                <div className="writing-response-footer">
                  <span className="writing-response-label">Ta réponse</span>
                </div>
                <textarea
                  className="writing-response"
                  value={writingResponse}
                  onChange={(e) => setWritingResponse(e.target.value)}
                  placeholder="Écris ta réponse ici…"
                />
                {writingFeedback && <p className="writing-feedback">{writingFeedback}</p>}
                <button className="level-test-submit" type="button" onClick={checkWritingResponse}>
                  Vérifier ma réponse <ArrowRight size={14} />
                </button>
              </div>
            )}
            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Compréhension écrite" ? (
          <section className="pte-practice-section">
            <header className="study-center-header">
              <span className="study-center-eyebrow"><BookOpen size={16} /> COMPRÉHENSION ÉCRITE</span>
              <h1>Lecture</h1>
              <p>Lis le passage et réponds aux questions de compréhension.</p>
            </header>
            <div className="practice-exercise-grid">
              {readingExercises.map((ex, index) => (
                <button
                  className="practice-exercise-card"
                  key={index}
                  type="button"
                  onClick={() => setSelectedReadingExercise(index)}
                >
                  <span className="practice-exercise-number">{index + 1}</span>
                  <strong>{ex.title}</strong>
                  <small>{ex.duration}</small>
                </button>
              ))}
            </div>
            {readingExercises[selectedReadingExercise] && (
              <div className="practice-prompt-card">
                <div className="practice-prompt-heading">
                  <div>
                    <h2>{readingExercises[selectedReadingExercise].title}</h2>
                    <span className="practice-duration">{readingExercises[selectedReadingExercise].duration}</span>
                  </div>
                </div>
                <p>{readingExercises[selectedReadingExercise].passage}</p>
                <form className="comprehension-quiz" onSubmit={(e) => submitComprehensionQuiz(e, readingExercises[selectedReadingExercise].questions, readingAnswers, setReadingResult)}>
                  {readingExercises[selectedReadingExercise].questions.map((q, qIndex) => (
                    <div key={qIndex}>
                      <p>{q.question}</p>
                      {q.options.map((opt, oIndex) => (
                        <label key={oIndex} className="level-test-option">
                          <input
                            type="radio"
                            name={"q" + qIndex}
                            value={oIndex}
                            checked={Number(readingAnswers[qIndex]) === oIndex}
                            onChange={(e) => {
                              const next = { ...readingAnswers };
                              next[qIndex] = e.target.value;
                              setReadingAnswers(next);
                            }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ))}
                  <button className="level-test-submit" type="submit">
                    Vérifier mes réponses <ArrowRight size={14} />
                  </button>
                </form>
                {readingResult && (
                  <div className="comprehension-result">
                    <div>
                      <strong>{readingResult.correct} / {readingResult.total}</strong>
                      <span>bonnes réponses</span>
                    </div>
                    <button className="level-test-submit" type="button" onClick={() => {
                      setReadingAnswers({});
                      setReadingResult(null);
                    }}>
                      Recommencer <RotateCcw size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Compréhension orale" ? (
          <section className="pte-practice-section">
            <header className="study-center-header">
              <span className="study-center-eyebrow"><Headset size={16} /> COMPRÉHENSION ORALE</span>
              <h1>Écoute</h1>
              <p>Écoute l’enregistrement et réponds aux questions de compréhension.</p>
            </header>
            <div className="practice-exercise-grid">
              {listeningExercises.map((ex, index) => (
                <button
                  className="practice-exercise-card"
                  key={index}
                  type="button"
                  onClick={() => setSelectedListeningExercise(index)}
                >
                  <span className="practice-exercise-number">{index + 1}</span>
                  <strong>{ex.title}</strong>
                  <small>{ex.duration}</small>
                </button>
              ))}
            </div>
            {listeningExercises[selectedListeningExercise] && (
              <div className="practice-prompt-card">
                <div className="practice-prompt-heading">
                  <div>
                    <h2>{listeningExercises[selectedListeningExercise].title}</h2>
                    <span className="practice-duration">{listeningExercises[selectedListeningExercise].duration}</span>
                  </div>
                </div>
                <div className="listening-audio-player">
                  <button
                    className="level-test-submit"
                    type="button"
                    onClick={playListeningExercise}
                  >
                    {isListeningAudioPlaying ? "Arrêter l’audio" : "Écouter l’audio"} <Mic size={15} />
                  </button>
                  {listeningAudioNotice && <span>{listeningAudioNotice}</span>}
                </div>
                <details className="listening-transcript">
                  <summary>Voir la transcription</summary>
                  <p>{listeningExercises[selectedListeningExercise].transcript}</p>
                </details>
                <form className="comprehension-quiz" onSubmit={(e) => submitComprehensionQuiz(e, listeningExercises[selectedListeningExercise].questions, listeningAnswers, setListeningResult)}>
                  {listeningExercises[selectedListeningExercise].questions.map((q, qIndex) => (
                    <div key={qIndex}>
                      <p>{q.question}</p>
                      {q.options.map((opt, oIndex) => (
                        <label key={oIndex} className="level-test-option">
                          <input
                            type="radio"
                            name={"q" + qIndex}
                            value={oIndex}
                            checked={Number(listeningAnswers[qIndex]) === oIndex}
                            onChange={(e) => {
                              const next = { ...listeningAnswers };
                              next[qIndex] = e.target.value;
                              setListeningAnswers(next);
                            }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ))}
                  <button className="level-test-submit" type="submit">
                    Vérifier mes réponses <ArrowRight size={14} />
                  </button>
                </form>
                {listeningResult && (
                  <div className="comprehension-result">
                    <div>
                      <strong>{listeningResult.correct} / {listeningResult.total}</strong>
                      <span>bonnes réponses</span>
                    </div>
                    <button className="level-test-submit" type="button" onClick={() => {
                      setListeningAnswers({});
                      setListeningResult(null);
                    }}>
                      Recommencer <RotateCcw size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
            <footer className="dashboard-footer">
              <span>LearnSpace © 2026</span>
              <span>Apprendre aujourd'hui. Réussir demain.</span>
            </footer>
          </section>
        ) : activeMenu === "Aide (Q&R)" ? (
          <section className="pte-practice-section">
            <header className="study-center-header">
              <span className="study-center-eyebrow"><CircleHelp size={16} /> AIDE (Q&R)</span>
              <h1>Besoin d’aide ?</h1>
              <p>Consulte les réponses aux questions fréquentes ou contacte l’équipe.</p>
            </header>
            <div className="dashboard-contact-grid">
              <aside className="dashboard-contact-info">
                <span className="dashboard-contact-icon"><Mail size={22} /></span>
                <h2>Contacter LearnSpace</h2>
                <p>Notre équipe est disponible pour répondre à tes questions sur les formations et ton espace professeur.</p>
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
                <span className="hero-label">BIENVENUE SUR L’ESPACE PROFESSEUR</span>
                <h1>{currentBanner.title}</h1>
                <p>{currentBanner.subtitle}</p>
                <button className="primary-button" onClick={() => navigate("/formations")}>{currentBanner.button} <ArrowRight size={15} /></button>
              </div>
              <button className="banner-arrow banner-next" onClick={nextBanner} aria-label="Bannière suivante"><ChevronRight size={25} /></button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
