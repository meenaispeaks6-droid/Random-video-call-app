import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const idToken = await result.user.getIdToken();
          
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
          });

          if (error) throw error;
        }
      } catch (error) {
        console.error("Firebase redirect result error:", error);
      }
    };

    handleRedirectResult();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await auth.signOut();
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Use redirect instead of popup to avoid iframe restrictions
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Firebase sign in error:", error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    signInWithGoogle,
  };
}
