import { createServerFn } from "@tanstack/react-start";

/**
 * Returns the Firebase *web* configuration. These values are publishable by
 * design (Firebase identifies the project with them; security comes from
 * Firebase rules + authorized domains), but the API key is kept in backend
 * config so it is never committed to source files.
 */
export const getFirebaseWebConfig = createServerFn({ method: "GET" }).handler(async () => {
  const apiKey = process.env.FIREBASE_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
  return {
    enabled: Boolean(apiKey),
    apiKey,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? "emo-learners-web.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID ?? "emo-learners-web",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "emo-learners-web.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "235947453691",
    appId: process.env.FIREBASE_APP_ID ?? "1:235947453691:web:ad1339541b71265baa945e",
  };
});
