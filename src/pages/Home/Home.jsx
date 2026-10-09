

import { Link } from "react-router-dom";
import CourseCard from "../../components/CourseCard.jsx";
import { courses, categories } from "../../data/courses.js";
import categoryDevelopment from "../../assets/category-development.svg";
import categoryDesign from "../../assets/category-design.svg";
import categoryMarketing from "../../assets/category-marketing.svg";
import categoryOffice from "../../assets/category-office.svg";
import courseReact from "../../assets/course-react.webp";
import courseDesign from "../../assets/course-design.webp";
import courseMarketing from "../../assets/course-marketing.webp";
import benefitLearning from "../../assets/benefit-learning.svg";
import benefitPractice from "../../assets/benefit-practice.svg";
import benefitProgress from "../../assets/benefit-progress.svg";

const categoryImages = [categoryDevelopment, categoryDesign, categoryMarketing, categoryOffice];
const featuredCourseImages = [courseReact, courseDesign, courseMarketing];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-pill">✦ Apprends à ton rythme</span>
            <h1>Développe tes compétences, <span>construis ton avenir.</span></h1>
            <p>Découvre des formations pratiques, apprends auprès de formateurs passionnés et avance vers tes objectifs professionnels.</p>
            <div className="hero-actions"><Link className="button button-fill-left button-primary-hover" to="/formations"><span>Explorer les formations</span><span>→</span></Link><Link className="button button-ghost button-fill-left" to="/dashboard">Mon espace étudiant</Link></div>
            <div className="hero-stats"><div><strong>4+</strong><span>Formations de démonstration</span></div><div><strong>100%</strong><span>En ligne</span></div><div><strong>À ton rythme</strong><span>Apprentissage flexible</span></div></div>
          </div>
          <div className="hero-visual">
            <div className="floating-tag tag-top">✦ Apprentissage flexible</div>
            <div className="hero-visual-card"><div className="hero-visual-icon">🎓</div><span className="eyebrow">TON PROCHAIN OBJECTIF</span><h2>Apprends aujourd'hui.</h2><h2 className="text-accent">Réussis demain.</h2><p>Un cours à la fois, un objectif à la fois.</p><div className="visual-progress"><div><span>Ta prochaine réussite</span><strong>80%</strong></div><div className="progress-track"><div className="progress-value" style={{width:"80%"}} /></div></div></div>
            <div className="floating-tag tag-bottom">✓ Progresse chaque jour</div>
          </div>
        </div>
      </section>
      <section className="section" id="categories"><div className="container"><div className="section-heading"><span className="eyebrow">APPRENDS CE QUI TE PASSIONNE</span><h2>Explore nos catégories</h2><p>Choisis un domaine et développe de nouvelles compétences.</p></div><div className="category-grid">{categories.filter((item) => item !== "Toutes").map((category, index) => <Link className="category-card" style={{ "--index": index }} to={`/formations?category=${encodeURIComponent(category)}`} key={category}><img className="category-icon" src={categoryImages[index]} alt="" /><h3>{category}</h3><span className="category-arrow">Explorer →</span></Link>)}</div></div></section>
      <section className="section section-muted" id="formations"><div className="container"><div className="section-heading section-heading-row"><div><span className="eyebrow">NOS COURS</span><h2>Formations populaires</h2><p>Une sélection pour commencer à apprendre dès aujourd'hui.</p></div><Link className="text-link course-section-link" to="/formations">Toutes les formations →</Link></div><div className="course-grid">{courses.slice(0,3).map((course, index) => <CourseCard course={course} image={featuredCourseImages[index]} key={course.id} />)}</div><div className="center-action"><Link className="button button-fill-left" to="/formations">Voir le catalogue complet →</Link></div></div></section>
      <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">POURQUOI LEARNSPACE ?</span><h2>Apprends autrement</h2><p>Tout ce qu'il te faut pour progresser à ton rythme.</p></div><div className="benefits-grid"><article className="benefit-card"><img className="benefit-illustration" src={benefitLearning} alt="" /><h3>À ton rythme</h3><p>Accède aux cours quand tu veux et avance selon tes disponibilités.</p></article><article className="benefit-card"><img className="benefit-illustration" src={benefitPractice} alt="" /><h3>Pratique et concret</h3><p>Découvre des notions utiles pour tes études et tes projets.</p></article><article className="benefit-card"><img className="benefit-illustration" src={benefitProgress} alt="" /><h3>Valorise tes progrès</h3><p>Suit ta progression et consulte un certificat simulé à la fin.</p></article></div></div></section>
      <section className="cta-section"><div className="container cta-inner"><div><span className="eyebrow">TON AVENIR COMMENCE ICI</span><h2>Prêt à commencer à apprendre ?</h2><p>Choisis une formation et fais ton premier pas.</p></div><Link to="/formations" className="button button-fill-left button-primary-hover"><span>Découvrir les cours →</span></Link></div></section>
    </>
  );
}
