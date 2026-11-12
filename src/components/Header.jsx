import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { getDemoRole, isDemoAuthenticated, logoutDemoAccount } from "../utils/demoAuth.js";
import { getSiteSettings } from "../utils/adminSettings.js";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const authenticated = isDemoAuthenticated();
  const role = getDemoRole();
  const siteSettings = getSiteSettings();
  const close = () => setOpen(false);
  const goHome = () => {
    close();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function logout() {
    logoutDemoAccount();
    close();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={close}><span className="brand-icon" aria-hidden="true" />{siteSettings.name}</Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
          {open ? "✕" : "☰"}
        </button>
        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          <NavLink to="/" end onClick={goHome}>Accueil</NavLink>
          <NavLink to="/formations" onClick={close}>Formations</NavLink>
          {role === "ADMIN" ? (
            <NavLink to="/admin" onClick={close}>Dashboard Admin</NavLink>
          ) : (
            <>
              <NavLink to="/dashboard" onClick={close}>Tableau de bord étudiant</NavLink>
              <NavLink to="/profil" onClick={close}>Mon profil</NavLink>
            </>
          )}
          {authenticated && (
            <button className="mobile-auth-action" type="button" onClick={logout}>Se déconnecter</button>
          )}
        </nav>
        {authenticated && (
          <button className="button button-small header-cta" type="button" onClick={logout}>Se déconnecter</button>
        )}
      </div>
    </header>
  );
}
