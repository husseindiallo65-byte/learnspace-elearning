import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard.jsx";
import { courses, categories } from "../../data/courses.js";
import { isDemoAuthenticated } from "../../utils/demoAuth.js";
import courseReact from "../../assets/course-react.webp";
import courseDesign from "../../assets/course-design.webp";
import courseMarketing from "../../assets/course-marketing.webp";
import courseOffice from "../../assets/course-office.webp";
import "./Home.css";

const featuredCourseImages = [courseReact, courseDesign, courseMarketing];
const categoryImages = {
  "Développement web": courseReact,
  "Design graphique": courseDesign,
  "Marketing digital": courseMarketing,
  Bureautique: courseOffice,
};
const categoryColors = {
  "Développement web": "green",
  "Design graphique": "purple",
  "Marketing digital": "mint",
  Bureautique: "blue",
};
const benefits = [
  {
    title: "À ton rythme",
    description: "Accède aux cours quand tu veux et avance selon tes disponibilités.",
    color: "purple",
  },
  {
    title: "Pratique et concret",
    description: "Découvre des notions utiles pour tes études et tes projets.",
    color: "blue",
  },
  {
    title: "Valorise tes progrès",
    description: "Suit ta progression et consulte un certificat simulé à la fin.",
    color: "green",
  },
];

function Icon({ name, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "search") {
    return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  }
  if (name === "menu") {
    return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
  }
  if (name === "close") {
    return <svg {...common}><path d="m18 6-12 12M6 6l12 12" /></svg>;
  }
  if (name === "play") {
    return <svg {...common} fill="currentColor" stroke="none"><path d="M8 5v14l11-7z" /></svg>;
  }
  if (name === "grid") {
    return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
  }
  if (name === "graduation") {
    return <svg {...common}><path d="m2 10 10-5 10 5-10 5-10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5m4-2v6" /></svg>;
  }
  return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function CategoryIcon({ category }) {
  const common = {
    className: "category-symbol",
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (category === "Développement web") {
    return <svg {...common}><rect x="6" y="8" width="36" height="25" rx="3" /><path d="M18 40h12m-6-7v7M17 16l-5 4 5 4m14-8 5 4-5 4m-5-6-4 10" /></svg>;
  }
  if (category === "Design graphique") {
    return <svg {...common}><path d="M24 7a17 17 0 1 0 0 34h3a4 4 0 0 0 2.7-7 3.8 3.8 0 0 1 2.6-6.6H35A6 6 0 0 0 41 21C39.5 13 32.5 7 24 7Z" /><circle cx="16" cy="20" r="2" /><circle cx="24" cy="15" r="2" /><circle cx="32" cy="19" r="2" /></svg>;
  }
  if (category === "Marketing digital") {
    return <svg {...common}><path d="M8 21h8l21-9v24l-21-9H8z" /><path d="M16 27v5l4 8h8l-5-11m15-16 3-4m-2 15h5m-6 10 4 4" /></svg>;
  }
  return <svg {...common}><rect x="7" y="12" width="34" height="27" rx="3" /><path d="M17 12V8h14v4m-24 9h34m-22 0v18m10-18v18" /></svg>;
}

function BenefitIcon({ title }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (title === "À ton rythme") {
    return <svg {...common}><circle cx="24" cy="25" r="16" /><path d="M24 15v10l7 4M18 5h12m-6 0v4" /></svg>;
  }
  if (title === "Pratique et concret") {
    return <svg {...common}><path d="M24 6 42 16 24 26 6 16 24 6Z" /><path d="m13 20v10c6 5 16 5 22 0V20m7-4v13m-7 8 7 4 7-4" /></svg>;
  }
  return <svg {...common}><path d="M8 39V26m11 13V18m11 21V29m11 10V10M6 40h36" /><path d="m8 20 11-8 11 9 11-12" /></svg>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactNotice, setContactNotice] = useState("");
  const [statCounts, setStatCounts] = useState({ courses: 1, online: 1 });
  const closeMenu = () => setMenuOpen(false);
  const scrollToSection = (sectionId) => {
    closeMenu();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };
  const goHome = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const authenticated = isDemoAuthenticated();
  const navigate = useNavigate();

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("nom");
    const email = formData.get("email");
    const message = formData.get("message");
    const subject = `Message LearnSpace de ${name}`;
    const body = `Nom : ${name}\nE-mail : ${email}\n\nMessage :\n${message}`;

    setContactNotice("Votre application de messagerie va s’ouvrir pour envoyer votre message.");
    window.location.href = `mailto:husseindiallo65@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    const targets = { courses: courses.length, online: 100 };
    const duration = 1400;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStatCounts(targets);
      return undefined;
    }

    let frameId;
    let startTime;
    const animateCounts = (time) => {
      if (startTime === undefined) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;

      setStatCounts({
        courses: Math.round(1 + (targets.courses - 1) * easedProgress),
        online: Math.round(1 + (targets.online - 1) * easedProgress),
      });

      if (progress < 1) frameId = window.requestAnimationFrame(animateCounts);
    };

    frameId = window.requestAnimationFrame(animateCounts);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="learnspace-home">
      <header className="ls-header">
        <Link to="/" className="ls-brand" aria-label="LearnSpace accueil" onClick={goHome}>
          <span className="ls-brand-icon" aria-hidden="true" />
          <span className="learn">Learn<span className="space">Space</span></span>
        </Link>

        <button
          className="ls-menu-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>

        <nav className={`ls-nav ${menuOpen ? "ls-nav-open" : ""}`} aria-label="Navigation principale">
          <Link className="active" to="/" onClick={goHome}>Accueil</Link>
          <a href="#formations" onClick={(event) => { event.preventDefault(); scrollToSection("formations"); }}>Formations</a>
          <a href="#categories" onClick={(event) => { event.preventDefault(); scrollToSection("categories"); }}>Catégories</a>
          <a href="#benefits" onClick={(event) => { event.preventDefault(); scrollToSection("benefits"); }}>Apprends autrement</a>
          <a href="#contact" onClick={(event) => { event.preventDefault(); scrollToSection("contact"); }}>Contact</a>
        </nav>

        <div className="ls-header-actions">
          <button className="ls-search" type="button" aria-label="Rechercher une formation" onClick={() => navigate("/formations", { state: { focusSearch: true } })}>
            <Icon name="search" />
          </button>
          <Link
            to={authenticated ? "/profil" : "/inscription"}
            className="user-button"
            aria-label={authenticated ? "Mon profil" : "S’inscrire ou se connecter"}
            title={authenticated ? "Mon profil" : "S’inscrire ou se connecter"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </Link>
        </div>
      </header>

      <section className="ls-hero" id="accueil">
        <div className="ls-hero-background" />
        <div className="ls-hero-inner">
          <div className="ls-hero-content">
            <div className="ls-badge">
              <span className="ls-badge-sparkle">✦</span>
              <span>Apprends à ton rythme</span>
            </div>

            <h1 className="ls-hero-title">
              <span className="ls-title-line">Développe tes compétences,</span>
              <span className="ls-title-line ls-gradient-text">construis ton avenir.</span>
            </h1>

            <p className="ls-description">
              Découvre des formations pratiques, apprends auprès de formateurs passionnés et avance vers tes objectifs professionnels.
            </p>

            <div className="ls-hero-buttons">
              <Link to="/formations" className="ls-primary-button button-fill-left">
                <span className="ls-play-circle"><Icon name="play" size={14} /></span>
                <span>Explorer les formations</span>
                <Icon name="arrow" size={19} />
              </Link>

              <Link to="/dashboard" className="ls-outline-button button-fill-left">
                <Icon name="grid" size={19} />
                <span>Mon espace étudiant</span>
              </Link>
            </div>
          </div>

        </div>

        <section className="ls-stats" aria-label="Nos formations">
          <div className="ls-stat-item"><strong>{statCounts.courses}+</strong><span>Formations de démonstration</span></div>
          <div className="ls-stat-item"><strong>{statCounts.online}%</strong><span>En ligne</span></div>
          <div className="ls-stat-item"><strong>À ton rythme</strong><span>Apprentissage flexible</span></div>
        </section>
      </section>

      <section className="ls-benefits section" id="benefits">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">POURQUOI LEARNSPACE ?</span>
            <h2>Apprends autrement</h2>
            <p>Tout ce qu'il te faut pour progresser à ton rythme.</p>
          </div>
          <div className="ls-features">
            {benefits.map((benefit) => (
              <article className="ls-feature-card" key={benefit.title}>
                <div className={`ls-feature-icon ${benefit.color}`}>
                  <BenefitIcon title={benefit.title} />
                </div>
                <div className="ls-feature-copy">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section ls-categories" id="categories">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow ls-categories-badge">
              <Icon name="graduation" size={19} />
              APPRENDS CE QUI TE PASSIONNE
            </span>
            <h2>Explore nos <span>catégories</span></h2>
            <p>Choisis un domaine et développe de nouvelles compétences.</p>
            <div className="ls-categories-underline" aria-hidden="true"><span /><span /></div>
          </div>
          <div className="category-grid">
            {categories.filter((item) => item !== "Toutes").map((category, index) => {
              const description = courses.find((course) => course.category === category)?.shortDescription;

              return (
                <Link
                  className={`category-card ls-category-card ${categoryColors[category]}`}
                  style={{ "--index": index }}
                  to={`/formations?category=${encodeURIComponent(category)}`}
                  key={category}
                >
                  <div className="ls-category-content">
                    <div className="category-icon">
                      <CategoryIcon category={category} />
                    </div>
                    <h3>{category}</h3>
                    {description && <p>{description}</p>}
                    <span className="category-arrow">
                      Explorer
                      <span className="ls-category-arrow-icon"><Icon size={19} /></span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-muted ls-courses" id="formations">
        <div className="container">
          <div className="section-heading section-heading-row">
            <div>
              <h2>Formations populaires</h2>
              <p>Une sélection pour commencer à apprendre dès aujourd'hui.</p>
            </div>
            <Link className="text-link course-section-link" to="/formations">Toutes les formations →</Link>
          </div>
          <div className="course-grid">
            {courses.slice(0, 3).map((course, index) => (
              <CourseCard course={course} image={featuredCourseImages[index]} key={course.id} />
            ))}
          </div>
          <div className="center-action">
            <Link className="button button-fill-left" to="/formations">Voir le catalogue complet →</Link>
          </div>
        </div>
      </section>

      <section className="ls-cta" id="cta">
        <div className="container ls-cta-inner">
          <div>
            <span className="eyebrow">TON AVENIR COMMENCE ICI</span>
            <h2>Prêt à commencer à apprendre ?</h2>
            <p>Choisis une formation et fais ton premier pas.</p>
          </div>
          <Link to="/formations" className="ls-primary-button button-fill-left">
            <span>Découvrir les cours</span>
            <Icon name="arrow" size={19} />
          </Link>
        </div>
      </section>

      <section className="ls-contact section" id="contact">
        <div className="container contact-container">
          <div className="contact-info">
            <div className="contact-badge">
              <span>NOUS CONTACTER</span>
            </div>

            <h2>
              Une question ?
              <span> Écrivons-nous.</span>
            </h2>

            <p className="contact-description">
              Remplis le formulaire et ton application de messagerie préparera l'envoi. Nous vous répondrons dans les plus brefs délais.
            </p>

            <div className="contact-features">
              <div className="contact-feature">
                <div className="feature-icon" aria-hidden="true">ϟ</div>
                <div>
                  <h3>Rapide</h3>
                  <p>Une réponse en un rien de temps.</p>
                </div>
              </div>

              <div className="contact-feature">
                <div className="feature-icon" aria-hidden="true">✓</div>
                <div>
                  <h3>Sécurisé</h3>
                  <p>Vos informations sont protégées.</p>
                </div>
              </div>

              <div className="contact-feature">
                <div className="feature-icon" aria-hidden="true">♧</div>
                <div>
                  <h3>À votre écoute</h3>
                  <p>Nous sommes là pour vous aider.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            <form onSubmit={handleContactSubmit}>
              <div className="contact-fields">
                <div className="form-group">
                  <label htmlFor="contact-nom"><span className="contact-label-icon" aria-hidden="true">♙</span> Nom</label>
                  <input
                    type="text"
                    id="contact-nom"
                    name="nom"
                    autoComplete="name"
                    placeholder="Veuillez entrer votre nom"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email"><span className="contact-label-icon" aria-hidden="true">✉</span> Adresse e-mail</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    autoComplete="email"
                    placeholder="Veuillez entrer votre adresse e-mail"
                    required
                  />
                </div>
              </div>

              <div className="form-group message-group">
                <label htmlFor="contact-message"><span className="contact-label-icon" aria-hidden="true">▤</span> Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Veuillez entrer votre message"
                  rows="6"
                  required
                />
              </div>

              {contactNotice && <p className="contact-notice" role="status">{contactNotice}</p>}
              <button type="submit" className="contact-submit button-fill-left">
                <span aria-hidden="true">➤</span>
                Envoyer le message
                <span className="submit-arrow" aria-hidden="true">→</span>
              </button>
            </form>

          </div>
        </div>
      </section>
    </div>
  );
}
