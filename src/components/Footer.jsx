import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link to="/" className="brand">Learn<span>Space</span></Link>
          <p>Apprends aujourd'hui, construis ton avenir.</p>
        </div>
        <div className="footer-links">
          <Link to="/formations">Formations</Link>
          <Link to="/dashboard">Tableau de bord</Link>
          <Link to="/profil">Profil étudiant</Link>
        </div>
        <small>© {new Date().getFullYear()} LearnSpace — Projet frontend pédagogique.</small>
      </div>
    </footer>
  );
}
