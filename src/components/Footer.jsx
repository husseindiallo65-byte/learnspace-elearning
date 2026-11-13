import { Link } from "react-router-dom";
import {
  Layers,
  Mail,
} from "lucide-react";
import "./Footer.css";
import instagramIcon from "../assets/social/instagram.png";
import youtubeIcon from "../assets/social/youtube.png";
import linkedinIcon from "../assets/social/linkedin.png";
import { getSiteSettings } from "../utils/adminSettings.js";

function Footer() {
  const siteSettings = getSiteSettings();

  return (
    <footer className="ls-footer">
      <div className="ls-footer-container">
        <div className="ls-footer-brand">
          <Link to="/" className="ls-footer-logo">
            <span className="ls-footer-logo-icon"><Layers size={29} /></span>
            <span>{siteSettings.name}</span>
          </Link>

          <p>{siteSettings.tagline}</p>

          <div className="ls-footer-socials">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src={instagramIcon} alt="" />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
              <img src={youtubeIcon} alt="" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <img src={linkedinIcon} alt="" />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" /></svg>
            </a>
          </div>
        </div>

        <nav className="ls-footer-column" aria-label="Explorer">
          <h4>Explorer</h4>
          <Link to="/#accueil">Accueil</Link>
          <Link to="/#formations">Formations</Link>
          <Link to="/#categories">Catégories</Link>
          <Link to="/#benefits">Apprendre autrement</Link>
          <Link to="/#contact">Contact</Link>
        </nav>

        <div className="ls-footer-contact">
          <h4>Besoin d’aide ?</h4>
          <p>Notre équipe est là pour vous accompagner dans votre parcours.</p>
          <label className="ls-footer-email-field">
            <Mail size={19} />
            <input
              type="email"
              name="email"
              autoComplete="email"
              aria-label="Votre adresse e-mail"
              placeholder="Votre adresse e-mail"
            />
          </label>
        </div>
      </div>

      <div className="ls-footer-bottom">
        <div className="ls-footer-bottom-container">
          <p>© {new Date().getFullYear()} {siteSettings.name}. Tous droits réservés.</p>
          <span>Apprendre aujourd’hui, réussir demain.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
