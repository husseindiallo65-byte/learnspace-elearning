import { getProfile, saveProfile } from "./storage.js";

const ACCOUNT_KEY = "learnspace-demo-account";
const SESSION_KEY = "learnspace-demo-session";
const PASSWORD_ITERATIONS = 120000;

function readStoredJson(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function encodeBytes(bytes) {
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}

async function hashPassword(password, salt) {
  const webCrypto = globalThis.crypto;
  if (!webCrypto?.subtle || !webCrypto.getRandomValues) {
    throw new Error("L’authentification de démonstration nécessite un navigateur sécurisé.");
  }

  const passwordKey = await webCrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await webCrypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PASSWORD_ITERATIONS, hash: "SHA-256" },
    passwordKey,
    256,
  );

  return new Uint8Array(hash);
}

export function getDemoAccount() {
  return readStoredJson(ACCOUNT_KEY);
}

export function getDemoSession() {
  return readStoredJson(SESSION_KEY);
}

export function getDemoRole() {
  const session = getDemoSession();
  const account = getDemoAccount();

  if (session?.role === "ADMIN" && session.demo === true) return "ADMIN";
  if (session?.email && session.email === account?.email && !account.suspended) {
    if (session.role === "ADMIN") return "ADMIN";
    if (session.role === "TEACHER") return "TEACHER";
    return "STUDENT";
  }
  return null;
}

export function getDemoUser() {
  const session = getDemoSession();
  const account = getDemoAccount();
  const role = getDemoRole();
  if (!role) return null;

  if (session?.demo === true && session.role === "ADMIN") {
    return { email: session.email, firstName: "Admin", lastName: "Démo", role: "ADMIN" };
  }

  if (account) {
    return {
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      role,
    };
  }
  return null;
}

export function isDemoAuthenticated() {
  return getDemoRole() !== null;
}

export async function registerDemoAccount({ firstName, lastName, email, password }) {
  if (getDemoAccount()) {
    throw new Error("Un compte de démonstration existe déjà dans ce navigateur. Connecte-toi plutôt.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("L’authentification de démonstration nécessite un navigateur sécurisé.");
  }
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await hashPassword(password, salt);
  const account = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    role: "STUDENT",
    salt: encodeBytes(salt),
    passwordHash: encodeBytes(passwordHash),
  };

  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  const profile = getProfile();
  saveProfile({
    ...profile,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
  });
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: account.email, role: "STUDENT" }));
}

export async function loginDemoAccount({ email, password }) {
  const account = getDemoAccount();
  if (!account) {
    throw new Error("Aucun compte de démonstration n’existe dans ce navigateur. Inscris-toi d’abord.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== account.email) {
    throw new Error("Adresse email ou mot de passe incorrect.");
  }

  const salt = Uint8Array.from(atob(account.salt), (character) => character.charCodeAt(0));
  const passwordHash = await hashPassword(password, salt);
  if (encodeBytes(passwordHash) !== account.passwordHash) {
    throw new Error("Adresse email ou mot de passe incorrect.");
  }
  if (account.suspended) {
    throw new Error("Ce compte est suspendu. Contacte l’administrateur de la plateforme.");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: account.email, role: account.role }));
}

export function updateDemoStudentAccount(updates) {
  const account = getDemoAccount();
  if (!account) throw new Error("Aucun compte étudiant local n’existe.");
  const updatedAccount = {
    ...account,
    firstName: updates.firstName.trim(),
    lastName: updates.lastName.trim(),
    suspended: Boolean(updates.suspended),
    role: "STUDENT",
  };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(updatedAccount));
  const profile = getProfile();
  saveProfile({
    ...profile,
    firstName: updatedAccount.firstName,
    lastName: updatedAccount.lastName,
    email: updatedAccount.email,
  });
  return updatedAccount;
}

export function deleteDemoStudentAccount() {
  const session = getDemoSession();
  const account = getDemoAccount();
  localStorage.removeItem(ACCOUNT_KEY);
  if (!session?.demo && session?.email === account?.email) localStorage.removeItem(SESSION_KEY);
}

export function startAdminDemoSession() {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    email: "admin-demo@learnspace.local",
    role: "ADMIN",
    demo: true,
  }));
}

export function logoutDemoAccount() {
  localStorage.removeItem(SESSION_KEY);
}
