import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Home from "./pages/Home/Home.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import Formations from "./pages/Formations/Formations.jsx";
import FormationDetail from "./pages/FormationDetail/FormationDetail.jsx";
import Course from "./pages/Course/Course.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Certificate from "./pages/Certificate/Certificate.jsx";
import NotFound from "./pages/NotFound.jsx";
import { isDemoAuthenticated } from "./utils/demoAuth.js";

function ProtectedRoute({ children }) {
  const location = useLocation();
  return isDemoAuthenticated()
    ? children
    : <Navigate to="/connexion" state={{ from: location }} replace />;
}

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {pathname !== "/" && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inscription" element={<Auth mode="register" />} />
          <Route path="/connexion" element={<Auth mode="login" />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route path="/formations/:id/cours/:chapterId" element={<Course />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/certificats/:id" element={<Certificate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
