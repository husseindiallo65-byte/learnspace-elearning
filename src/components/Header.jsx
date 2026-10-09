import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import learnspaceLogo from "../assets/learnspace-logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={close}><img className="brand-logo" src={learnspaceLogo} alt="" />Learn<span>Space</span></Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
          {open ? "✕" : "☰"}
        </button>
        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          <NavLink to="/" end onClick={close}>Accueil</NavLink>
          <NavLink to="/formations" onClick={close}>Formations</NavLink>
          <NavLink to="/dashboard" onClick={close}>Mon tableau de bord</NavLink>
          <NavLink to="/profil" onClick={close}>Mon profil</NavLink>
        </nav>
        <Link className="button button-small button-fill-left button-primary-hover header-cta" to="/formations"><span>Commencer</span></Link>
      </div>
    </header>
  );
}
