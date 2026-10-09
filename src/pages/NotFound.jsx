import { Link } from "react-router-dom";

export default function NotFound() {
  return <section className="page-section"><div className="container empty-state panel"><span>🧭</span><h1>Page introuvable</h1><p>Cette page n'existe pas ou le lien est incorrect.</p><Link className="button" to="/">Retour à l'accueil</Link></div></section>;
}
