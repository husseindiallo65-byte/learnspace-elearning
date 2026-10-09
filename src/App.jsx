import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Formations from "./pages/Formations/Formations.jsx";
import FormationDetail from "./pages/FormationDetail/FormationDetail.jsx";
import Course from "./pages/Course/Course.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Certificate from "./pages/Certificate/Certificate.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route path="/formations/:id/cours/:chapterId" element={<Course />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/certificats/:id" element={<Certificate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
