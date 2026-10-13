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

export function isDemoAuthenticated() {
  const session = getDemoSession();
  const account = getDemoAccount();
  return Boolean(session?.email && session.email === account?.email);
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
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: account.email }));
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

  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: account.email }));
}

export function logoutDemoAccount() {
  localStorage.removeItem(SESSION_KEY);
}
