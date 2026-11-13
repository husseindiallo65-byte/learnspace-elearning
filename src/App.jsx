import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Home from "./pages/Home/Home.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import Formations from "./pages/Formations/Formations.jsx";
import FormationDetail from "./pages/FormationDetail/FormationDetail.jsx";
import Course from "./pages/Course/Course.jsx";
import CoursePlayer from "./pages/Course/CoursePlayer.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Certificate from "./pages/Certificate/Certificate.jsx";
import CertificateVerification from "./pages/Certificate/CertificateVerification.jsx";
import NotFound from "./pages/NotFound.jsx";
import { getDemoRole } from "./utils/demoAuth.js";
import { getSiteSettings } from "./utils/adminSettings.js";

function ProtectedRoute({ children, role, roles }) {
  const location = useLocation();
  const activeRole = getDemoRole();
  const allowedRoles = roles || (role ? [role] : []);

  if (!activeRole) return <Navigate to="/connexion" state={{ from: location }} replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(activeRole)) {
    return <Navigate to={activeRole === "ADMIN" ? "/admin" : "/dashboard"} replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const { pathname } = location;
  const [isRefreshing, setIsRefreshing] = useState(true);
  const hideHeader = pathname === "/dashboard" || pathname.startsWith("/admin") || pathname === "/" || pathname.startsWith("/course/");
  const hideFooter = pathname === "/dashboard" || pathname.startsWith("/admin") || pathname.startsWith("/course/");

  useEffect(() => {
    setIsRefreshing(true);
    const timeoutId = window.setTimeout(() => setIsRefreshing(false), 850);
    return () => window.clearTimeout(timeoutId);
  }, [location.key]);

  useEffect(() => {
    const section = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, location.hash]);

  useEffect(() => {
    const settings = getSiteSettings();
    document.title = `${settings.name} — Apprends, progresse, réussis`;
    document.documentElement.style.setProperty("--primary", settings.accentColor);
  }, [pathname]);

  useEffect(() => {
    const targets = document.querySelectorAll(
      "main h1, main h2, main h3, main p, main .eyebrow, main .course-card, main .category-card, main .benefit-card, main .ls-feature-card, main .ls-stat-item, main .panel"
    );

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.setAttribute("data-scroll-revealed", "true"));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-scroll-revealed", "true");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

    targets.forEach((target) => {
      target.setAttribute("data-scroll-reveal", "true");
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
      targets.forEach((target) => {
        target.removeAttribute("data-scroll-reveal");
        target.removeAttribute("data-scroll-revealed");
      });
    };
  }, [pathname]);

  return (
    <div className="app-shell">
      {!hideHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inscription" element={<Auth mode="register" />} />
          <Route path="/connexion" element={<Auth mode="login" />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<ProtectedRoute role="STUDENT"><FormationDetail /></ProtectedRoute>} />
          <Route path="/course/:id" element={<ProtectedRoute roles={["STUDENT", "ADMIN"]}><CoursePlayer /></ProtectedRoute>} />
          <Route path="/formations/:id/cours/:chapterId" element={<ProtectedRoute role="STUDENT"><Course /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute role="STUDENT"><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute role="STUDENT"><Profile /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute role="STUDENT"><Profile /></ProtectedRoute>} />
          <Route path="/certificats/:id" element={<ProtectedRoute role="STUDENT"><Certificate /></ProtectedRoute>} />
          <Route path="/verify-certificate/:certificateId" element={<CertificateVerification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      {!hideHeader && <BackToTop />}
      {isRefreshing && (
        <div className="page-refresh-loader" role="status" aria-label="Chargement de la page">
          <span className="page-refresh-loader-ring">
            <span className="page-refresh-loader-icon" aria-hidden="true" />
          </span>
        </div>
      )}
    </div>
  );
}
