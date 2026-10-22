import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getProfile } from "../../utils/storage.js";
import {
  BookOpen, LayoutDashboard, GraduationCap, BookMarked,
  Settings, Star, Bell, CircleHelp, LogOut, ChevronDown,
  ChevronLeft, ChevronRight, FileText, Mic,
  Brain, Monitor, Download, ArrowRight, Menu,
  X, Flame, Target, CheckCircle2
} from "lucide-react";
import "./Dashboard.css";

const menuItems = [
  { label: "Tableau de bord", icon: LayoutDashboard },
  { label: "Centre d'étude", icon: BookOpen },
  { label: "Tests blancs", icon: Monitor },
  { label: "Vocabulaire", icon: BookMarked },
  { label: "Paramètres", icon: Settings },
  { label: "VIP", icon: Star },
  { label: "Notifications", icon: Bell },
  { label: "Aide (Q&R)", icon: CircleHelp },
  { label: "Contact", icon: FileText },
  { label: "Se déconnecter", icon: LogOut },
];

const resources = [
  { title: "Vocabulaire", subtitle: "90% du vocabulaire d'examen", icon: FileText },
  { title: "Expression orale", subtitle: "Améliore ton oral en 14 jours", icon: Mic },
  { title: "Analyse IA", subtitle: "Précision en 14 jours", icon: Brain },
  { title: "Tests blancs", subtitle: "Tests types PTE", icon: Monitor },
];

const lessons = [
  { title: "Guide PTE", image: "https://i.ibb.co/JFKJ90MR/male-programmer-types-code-computer-running-script.jpg" },
  { title: "Expression orale", image: "https://i.ibb.co/m5wLr8ND/istockphoto-2223628632-1024x1024.jpg" },
  { title: "Expression écrite", image: "https://i.ibb.co/sp8PxMrg/company-office-worker-having-documentation-clipboard-coffee-cup-looking-project-management-charts-yo.webp" },
  { title: "Compréhension écrite", image: "https://i.ibb.co/SDrb4WBn/creative-manager-assisting-male-editor.webp" },
  { title: "Compréhension orale", image: "https://i.ibb.co/Lzz2ccKy/african-american-girl-comparing-course-notes-with-data-from-library-collection.webp" },
  { title: "Modèles", image: "https://i.ibb.co/1YDRWqhq/african-american-man-working-computer-write-code-programming.jpg" },
];

export default function Dashboard() {
  const profile = getProfile();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Tableau de bord");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [banner, setBanner] = useState(0);

  const banners = [
    {
      title: "Tests blancs PTE Master",
      subtitle: "Entraîne-toi intelligemment. Atteins ton objectif.",
      button: "En savoir plus",
      image: "https://i.ibb.co/RkN8n0mT/portrait-happy-server-farm-team-looks-data-analysis-graphs.jpg",
    },
    {
      title: "Ton succès commence ici",
      subtitle: "Pratique tous les jours et améliore ton score.",
      button: "Commencer",
      image: "https://i.ibb.co/RkN8n0mT/portrait-happy-server-farm-team-looks-data-analysis-graphs.jpg",
    },
  ];

  const currentBanner = banners[banner];
  const nextBanner = () => setBanner((banner + 1) % banners.length);
  const previousBanner = () => setBanner((banner - 1 + banners.length) % banners.length);

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
            <button key={label} className={`sidebar-link ${activeMenu === label ? "active" : ""}`} onClick={() => { if (label === "Se déconnecter") { localStorage.removeItem("learnspace_profile"); localStorage.removeItem("learnspace_auth"); sessionStorage.clear(); navigate("/auth"); return; } setActiveMenu(label); setSidebarOpen(false); }}>
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

      <main className="main-content" id="home">
        <header className="topbar">
          <button className="mobile-logo"><GraduationCap size={23} /> LearnSpace</button>
          <nav className="top-navigation">
            <button className="top-nav-item">Pratique PTE <ChevronDown size={13} /></button>
            <button className="top-nav-item">Prévisions</button>
            <button className="top-nav-item">Cours</button>
            <button className="top-nav-item">Communauté</button>
            <button className="top-nav-item">Application</button>
          </nav>
          <div className="topbar-actions">
            <button className="notification-button" aria-label="Notifications"><Bell size={17} /><span /></button>
            <button className="vip-button">Passer en VIP <Star size={14} /></button>
            <img className="avatar" src="https://i.ibb.co/yBfLSf2J/Certificat-de-r-ussite-en-marketing-digital.png" alt="Profil étudiant" />
          </div>
        </header>

        <section className="hero-banner">
          <img key={currentBanner.image} className="hero-image" src={currentBanner.image} alt="Étudiants en formation" />
          <div className="hero-shade" />
          <button className="banner-arrow banner-prev" onClick={previousBanner} aria-label="Bannière précédente"><ChevronLeft size={25} /></button>
          <div className="hero-card">
            <span className="hero-label">BIENVENUE SUR LEARNSPACE</span>
            <h1>{currentBanner.title}</h1>
            <p>{currentBanner.subtitle}</p>
            <button className="primary-button">{currentBanner.button} <ArrowRight size={15} /></button>
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
          <article className="stat-card prediction-card">
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
            <button onClick={() => setActiveMenu("Centre d'examen")}>Rejoindre <ArrowRight size={15} /></button>
          </article>
          <article className="join-card group-card">
            <div className="join-icon"><CheckCircle2 size={24} /></div>
            <div className="join-description">
              <h2>Rejoindre notre groupe</h2>
              <p>Apprends et échange avec nous</p>
            </div>
            <button onClick={() => setActiveMenu("Groupe")}>Rejoindre <ArrowRight size={15} /></button>
          </article>
        </section>

        <footer className="dashboard-footer">
          <span>LearnSpace © 2026</span>
          <span>Apprendre aujourd'hui. Réussir demain.</span>
        </footer>
      </main>
    </div>
  );
}
