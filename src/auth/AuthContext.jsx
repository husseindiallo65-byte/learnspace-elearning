import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getDemoUser,
  loginDemoAccount,
  logoutDemoAccount,
  registerDemoAccount,
  startAdminDemoSession,
  updateDemoStudentAccount,
} from "../utils/demoAuth.js";

const AuthContext = createContext(null);

export const ROLES = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: "Étudiant",
  [ROLES.ADMIN]: "Administrateur",
  [ROLES.TEACHER]: "Professeur",
};

/** Destination de chaque rôle : source unique de vérité pour toutes les redirections. */
export const ROLE_HOME = {
  [ROLES.STUDENT]: "/dashboard/student",
  [ROLES.ADMIN]: "/admin",
  [ROLES.TEACHER]: "/dashboard/teacher",
};

export function getRoleHome(role) {
  return ROLE_HOME[role] || "/connexion";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaure la session persistée (localStorage) au premier montage.
  useEffect(() => {
    setUser(getDemoUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    await loginDemoAccount({ email, password });
    const nextUser = getDemoUser();
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (values) => {
    await registerDemoAccount(values);
    const nextUser = getDemoUser();
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    logoutDemoAccount();
    setUser(null);
  }, []);

  const loginAsAdminDemo = useCallback(() => {
    startAdminDemoSession();
    const nextUser = getDemoUser();
    setUser(nextUser);
    return nextUser;
  }, []);

  const updateProfile = useCallback((updates) => {
    const updated = updateDemoStudentAccount(updates);
    setUser(getDemoUser());
    return updated;
  }, []);

  const refresh = useCallback(() => setUser(getDemoUser()), []);

  const value = useMemo(() => {
    const role = user?.role || null;
    return {
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      role,
      isStudent: role === ROLES.STUDENT,
      isAdmin: role === ROLES.ADMIN,
      isTeacher: role === ROLES.TEACHER,
      homePath: getRoleHome(role),
      login,
      register,
      logout,
      loginAsAdminDemo,
      updateProfile,
      refresh,
    };
  }, [user, isLoading, login, register, logout, loginAsAdminDemo, updateProfile, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider.");
  }
  return context;
}
