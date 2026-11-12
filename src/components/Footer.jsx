import { Link } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  UserRound,
  Layers3,
} from "lucide-react";
import "./Footer.css";
import instagramIcon from "../assets/social/instagram.png";
import youtubeIcon from "../assets/social/youtube.png";
import linkedinIcon from "../assets/social/linkedin.png";
import tiktokIcon from "../assets/social/tiktok.png";
import { getSiteSettings } from "../utils/adminSettings.js";

function Footer() {
  const siteSettings = getSiteSettings();
  return (
    <footer className="learnspace-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">
              <Layers3 size={36} strokeWidth={2.5} />
            </div>

            <span>{siteSettings.name}</span>
          </Link>

          <p className="footer-description">
            {siteSettings.tagline}
          </p>

          <div className="footer-socials">
            <a href="https://www.instagram.com/" aria-label="Instagram">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://www.youtube.com/" aria-label="YouTube">
              <img src={youtubeIcon} alt="YouTube" />
            </a>
            <a href="https://www.linkedin.com/" aria-label="LinkedIn">
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
            <a href="https://www.tiktok.com/" aria-label="TikTok">
              <img src={tiktokIcon} alt="TikTok" />
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

          <Link to="/profil" className="footer-nav-link">
            <UserRound size={30} />
            <span>Profil étudiant</span>
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
