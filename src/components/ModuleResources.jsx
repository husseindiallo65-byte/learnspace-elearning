import { Download, ExternalLink, FileText } from "lucide-react";
import { saveResourceDownload } from "../utils/storage.js";
import "./ModuleResources.css";

function getResourceHref(url) {
  if (typeof url !== "string" || !url.trim()) return null;

  try {
    const parsedUrl = new URL(url, window.location.origin);
    return ["http:", "https:"].includes(parsedUrl.protocol) ? url : null;
  } catch {
    return null;
  }
}

export default function ModuleResources({ resources = [], courseId, moduleId }) {
  const validResources = resources
    .map((resource) => ({ ...resource, href: getResourceHref(resource.url) }))
    .filter((resource) => resource.href);

  return (
    <section className="module-resources" aria-labelledby="module-resources-title">
      <div className="module-resources-heading">
        <span className="module-resources-icon"><FileText size={18} /></span>
        <div>
          <h2 id="module-resources-title">Ressources du module</h2>
          <p>Documents complémentaires pour accompagner ta leçon.</p>
        </div>
      </div>
      {validResources.length ? (
        <ul className="module-resource-list">
          {validResources.map((resource) => (
            <li className="module-resource-item" key={resource.id || resource.url}>
              <span className="module-resource-file-icon"><FileText size={17} /></span>
              <span className="module-resource-copy">
                <strong>{resource.title || "Ressource du module"}</strong>
                <small>
                  {[resource.type || "Document", resource.size].filter(Boolean).join(" · ")}
                </small>
              </span>
              <span className="module-resource-actions">
                {resource.downloadable && (
                  <a
                    href={resource.href}
                    download
                    aria-label={`Télécharger ${resource.title || "la ressource"}`}
                    onClick={() => saveResourceDownload({
                      courseId,
                      moduleId,
                      resourceId: resource.id || resource.url,
                    })}
                  >
                    <Download size={16} />
                  </a>
                )}
                <a href={resource.href} target="_blank" rel="noreferrer" aria-label={`Ouvrir ${resource.title || "la ressource"} dans un nouvel onglet`}>
                  <ExternalLink size={16} />
                </a>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="module-resources-empty">Aucune ressource n’est disponible pour ce module pour le moment.</p>
      )}
    </section>
  );
}
