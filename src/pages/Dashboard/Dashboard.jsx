import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getProfile } from "../../utils/storage.js";
import { logoutDemoAccount } from "../../utils/demoAuth.js";
import {
  BookOpen, LayoutDashboard, GraduationCap, BookMarked,
  Settings, Star, Bell, CircleHelp, LogOut, ChevronDown,
  ChevronLeft, ChevronRight, FileText, Mic,
  Brain, Monitor, Download, ArrowRight, Menu,
  X, Flame, Target, CheckCircle2, User, Globe, Moon, Shield, Mail
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
  { title: "Guide PTE", image: courseReactImg },
  { title: "Expression orale", image: courseDesignImg },
  { title: "Expression écrite", image: courseMarketingImg },
  { title: "Compréhension écrite", image: courseOfficeImg },
  { title: "Compréhension orale", image: courseReactImg },
  { title: "Modèles", image: courseDesignImg },
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
            <button key={label} className={`sidebar-link ${activeMenu === label ? "active" : ""}`} onClick={() => { if (label === "Se déconnecter") { logoutDemoAccount(); navigate("/connexion"); return; } if (label === "Contact") { navigate("/"); setTimeout(() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 150); setSidebarOpen(false); setActiveMenu(label); return; } setActiveMenu(label); setSidebarOpen(false); if (label === "Paramètres" || label === "Aide (Q&R)") window.scrollTo({ top: 0, behavior: "smooth" }); }}>
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
            <img className="avatar" src={profile.photo || "https://i.ibb.co/yBfLSf2J/Certificat-de-r-ussite-en-marketing-digital.png"} alt="Profil étudiant" onClick={() => navigate("/profil")} style={{ cursor: 'pointer' }} />
          </div>
        </header>

        {activeMenu === "Aide (Q&R)" ? (
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
