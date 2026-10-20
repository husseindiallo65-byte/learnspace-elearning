import { Link } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  UserRound,
  Layers3,
} from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="learnspace-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">
              <Layers3 size={36} strokeWidth={2.5} />
            </div>

            <span>
              Learn<span className="footer-logo-accent">Space</span>
            </span>
          </Link>

          <p className="footer-description">
            Apprends aujourd'hui, construis ton avenir.
          </p>

          <div className="footer-socials">
            <a href="https://www.facebook.com/" aria-label="Facebook">
              f
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram">
              ◎
            </a>
            <a href="https://www.youtube.com/" aria-label="YouTube">
              ▶
            </a>
            <a href="https://www.linkedin.com/" aria-label="LinkedIn">
              in
            </a>
          </div>
        </div>

        <nav className="footer-navigation" aria-label="Navigation du pied de page">
          <Link to="/formations" className="footer-nav-link">
            <GraduationCap size={30} />
            <span>Formations</span>
          </Link>

          <Link to="/dashboard" className="footer-nav-link">
            <LayoutDashboard size={30} />
            <span>Tableau de bord</span>
          </Link>

          <Link to="/profile" className="footer-nav-link">
            <UserRound size={30} />
            <span>Profil étudiant</span>
          </Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-copyright">
            <span className="footer-accent-line"></span>
            <p>
              © {new Date().getFullYear()} LearnSpace — Projet frontend
              pédagogique.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
