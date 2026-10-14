import { useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { isDemoAuthenticated, logoutDemoAccount } from "../utils/demoAuth.js";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const authenticated = isDemoAuthenticated();
  const isRegistrationPage = pathname === "/inscription";
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
        <Link to="/" className="brand" onClick={close}><span className="brand-icon" aria-hidden="true" />Learn<span>Space</span></Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
          {open ? "✕" : "☰"}
        </button>
        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          <NavLink to="/" end onClick={goHome}>Accueil</NavLink>
          <NavLink to="/formations" onClick={close}>Formations</NavLink>
          <NavLink to="/dashboard" onClick={close}>Catégories</NavLink>
          <NavLink to="/profil" onClick={close}>Apprends autrement</NavLink>
          {authenticated ? (
            <button className="mobile-auth-action" type="button" onClick={logout}>Se déconnecter</button>
          ) : !isRegistrationPage ? (
            <NavLink className="mobile-auth-action" to="/inscription" onClick={close}>S’inscrire / Se connecter</NavLink>
          ) : null}
        </nav>
        {authenticated ? (
          <button className="button button-small header-cta" type="button" onClick={logout}>Se déconnecter</button>
        ) : !isRegistrationPage ? (
          <Link className="button button-small button-fill-left button-primary-hover header-cta" to="/inscription"><span>S’inscrire / Se connecter</span></Link>
        ) : null}
      </div>
    </header>
  );
}
