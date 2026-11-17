import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Garde de route.
 * - `roles` absent  -> il suffit d'être connecté.
 * - `roles` string ou tableau  -> le rôle de l'utilisateur doit appartenir à la liste.
 */
export default function ProtectedRoute({ children, roles }) {
  const { isLoading, isAuthenticated, role, homePath } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="page-refresh-loader" role="status" aria-label="Chargement de la page">
        <span className="page-refresh-loader-ring">
          <span className="page-refresh-loader-icon" aria-hidden="true" />
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  const allowedRoles = Array.isArray(roles) ? roles : roles ? [roles] : [];
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Connecté mais sans autorisation : retour vers SON tableau de bord.
    return <Navigate to={homePath} replace />;
  }

  return children;
}
