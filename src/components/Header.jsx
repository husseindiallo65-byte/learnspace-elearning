import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { logoutDemoAccount } from "../utils/demoAuth.js";
import { getSiteSettings } from "../utils/adminSettings.js";
import { LayoutDashboard } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, role, isTeacher, isAdmin, isStudent } = useAuth();
  const siteSettings = getSiteSettings();
  const close = () => setOpen(false);

  const goHome = () => {
    close();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logout = () => {
    logoutDemoAccount();
    close();
    navigate("/");
  };

  function getDashboardPath() {
    switch (role) {
      case "TEACHER": return "/dashboard/teacher";
      case "ADMIN": return "/admin";
      default: return "/dashboard/student";
    }
  }

  function getDashboardLabel() {
    switch (role) {
      case "TEACHER": return "Dashboard professeur";
      case "ADMIN": return "Dashboard administrateur";
      default: return "Tableau de bord étudiant";
    }
  }

  function getProfileLink() {
    switch (role) {
      case "TEACHER": return "/profil";
      case "ADMIN": return "/admin";
      default: return "/profil";
    }
  }

  const handleDashboardClick = () => {
    close();
    if (!isAuthenticated) {
      navigate("/connexion");
      return;
    }
    navigate(getDashboardPath());
  };

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
          {isAuthenticated ? (
            <NavLink to={getDashboardPath()} onClick={close}>
              <LayoutDashboard size={16} /> {getDashboardLabel()}
            </NavLink>
          ) : (
            <button type="button" className="admin-nav-link" onClick={handleDashboardClick}>
              <LayoutDashboard size={16} /> {getDashboardLabel()}
            </button>
          )}
          {isStudent ? (
            <NavLink to={getProfileLink()} onClick={close}>Mon profil</NavLink>
          ) : null}
          {isAuthenticated && (
            <button className="mobile-auth-action" type="button" onClick={logout}>Se déconnecter</button>
          )}
        </nav>
        {isAuthenticated && (
          <button className="button button-small header-cta" type="button" onClick={logout}>Se déconnecter</button>
        )}
      </div>
    </header>
  );
}
