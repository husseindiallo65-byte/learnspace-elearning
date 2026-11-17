import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * RoleBasedRedirect : redirige immédiatement l'utilisateur vers son tableau de bord
 * selon son rôle. À utiliser sur les pages d'authentification (login/inscription)
 * lorsqu'un utilisateur est déjà connecté.
 *
 * Si l'utilisateur n'est pas encore connecté, rend null (laisse la page s'afficher).
 */
export default function RoleBasedRedirect({ from }) {
  const { isLoading, isAuthenticated, role, homePath } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const redirectTo = from || homePath || "/connexion";
  return <Navigate to={redirectTo} replace />;
}
