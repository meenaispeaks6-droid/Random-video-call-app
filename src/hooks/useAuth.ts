"use client";

import { useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          image: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      window.location.href = "/";
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error("Firebase Auth not initialized. Check your environment variables.");
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Firebase sign in error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const getIdToken = async () => {
    if (!auth?.currentUser) {
      throw new Error("You must be signed in to continue.");
    }

    return auth.currentUser.getIdToken();
  };

  return {
    user,
    loading,
    signOut,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    getIdToken,
  };
}
