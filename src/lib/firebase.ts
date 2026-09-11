import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserPopupRedirectResolver,
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type Auth,
} from "firebase/auth";

let authPromise: Promise<Auth> | null = null;
const FIREBASE_APP_NAME = "emo-learners-web";

/**
 * Firebase *web* config. These identifiers are publishable by design (security
 * comes from Firebase authorized domains + rules), so they can ship with the
 * client bundle. This keeps Google sign-in working on any host (Vercel, custom
 * domain) without extra server configuration.
 */
const WEB_CONFIG = {
  apiKey: import.meta.env['VITE_FIREBASE_API_KEY'] ?? "AIzaSyDhRHC6a5x7BJre1tTjbK3lFlT8JrxCOww",
  authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'] ?? "emo-learners-web.firebaseapp.com",
  projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'] ?? "emo-learners-web",
  storageBucket:
    import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'] ?? "emo-learners-web.firebasestorage.app",
  messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'] ?? "235947453691",
  appId: import.meta.env['VITE_FIREBASE_APP_ID'] ?? "1:235947453691:web:ad1339541b71265baa945e",
};

/** Lazily boots the Firebase web app in the browser only. */
export function getFirebaseAuth(): Promise<Auth> {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser only"));
  if (!authPromise) {
    authPromise = (async () => {
      const config = WEB_CONFIG;
      if (!config.apiKey) throw new Error("firebase/not-configured");
      const app: FirebaseApp =
        getApps().find((candidate) => candidate.name === FIREBASE_APP_NAME) ??
        initializeApp(config, FIREBASE_APP_NAME);
      return getAuth(app);
    })().catch((err) => {
      authPromise = null;
      throw err;
    });
  }
  return authPromise;
}

function googleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

const POPUP_FALLBACK_CODES = new Set([
  "auth/popup-blocked",
  "auth/operation-not-supported-in-this-environment",
  "auth/web-storage-unsupported",
  // Some browsers (in-app webviews, strict privacy settings, cross-origin
  // isolation) close the Google window before it can report back. Falling back
  // to the full-page flow is far more reliable than surfacing an error.
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/internal-error",
]);

/**
 * Signs in with Google through Firebase and returns a fresh Firebase ID token.
 * Falls back to the redirect flow where popups are unavailable (some mobile
 * browsers / in-app webviews). Returns null when a redirect has started.
 */
export async function firebaseGoogleSignIn(): Promise<string | null> {
  const auth = await getFirebaseAuth();
  try {
    const cred = await signInWithPopup(auth, googleProvider(), browserPopupRedirectResolver);
    return await cred.user.getIdToken(true);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code ?? "";
    if (POPUP_FALLBACK_CODES.has(code)) {
      await signInWithRedirect(auth, googleProvider());
      return null;
    }
    throw err;
  }
}

/** Picks up a pending Firebase redirect sign-in, if any. */
export async function firebaseRedirectIdToken(): Promise<string | null> {
  const auth = await getFirebaseAuth();
  const result = await getRedirectResult(auth);
  if (!result?.user) return null;
  return await result.user.getIdToken(true);
}

/** Clears any Firebase session. Safe to call when Firebase was never used. */
export async function firebaseSignOutIfSignedIn(): Promise<void> {
  if (typeof window === "undefined") return;
  if (getApps().length === 0) return;
  try {
    const auth = await getFirebaseAuth();
    if (auth.currentUser) await firebaseSignOut(auth);
  } catch {
    /* ignore */
  }
}

/** Turns Firebase auth errors into something a student can act on. */
export function friendlyFirebaseError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const message = (err as { message?: string })?.message ?? "";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request")
    return "Google sign-in was cancelled. Please try again.";
  if (code === "auth/popup-blocked")
    return "Your browser blocked the Google window. Please allow pop-ups and try again.";
  if (code === "auth/network-request-failed")
    return "We couldn't reach Google. Please check your internet connection and try again.";
  if (code === "auth/unauthorized-domain")
    return "Google sign-in isn't allowed on this address yet. Please try again from the main site.";
  if (code === "auth/account-exists-with-different-credential" || message.includes("link-existing"))
    return "An account with this email already exists. Please sign in using your existing login method to connect Google.";
  if (message.includes("google-verification-failed"))
    return "Google could not verify this sign-in. Please choose your account and try again.";
  if (message.includes("google-signin-failed") || message.includes("google-session-not-created"))
    return "Google verified your account, but the app could not start your session. Please try again.";
  if (message.toLowerCase().includes("token") || message.toLowerCase().includes("otp"))
    return "Your Google sign-in expired before it completed. Please try again.";
  if (message.includes("not-configured"))
    return "Google sign-in isn't set up yet. Please use your email and password for now.";
  return "We couldn't sign you in with Google. Please try again, or use your email and password.";
}
