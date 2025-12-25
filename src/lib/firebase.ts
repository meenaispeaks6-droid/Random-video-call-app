import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 && firebaseConfig.apiKey !== "placeholder" 
  ? initializeApp(firebaseConfig) 
  : getApps()[0] || (firebaseConfig.apiKey !== "placeholder" ? initializeApp(firebaseConfig) : null);

const db = app ? getDatabase(app, "https://funkey-a2ae0-default-rtdb.asia-southeast1.firebasedatabase.app") : null;
const auth = app ? getAuth(app) : null;

export { db, auth };
