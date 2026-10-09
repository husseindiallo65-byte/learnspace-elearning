import { Link } from "react-router-dom";
import learnspaceLogo from "../assets/learnspace-logo.png";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link to="/" className="brand"><img className="brand-logo" src={learnspaceLogo} alt="" />Learn<span>Space</span></Link>
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
