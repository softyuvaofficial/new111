import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setLoading(false);

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    const { error, user: signedInUser } = await supabase.auth.signIn({
      email,
      password,
    });
    setUser(signedInUser);
    setLoading(false);
    if (error) throw error;
    return signedInUser;
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      throw error;
    }
    setUser(null);
    setLoading(false);
  }, []);

  return { user, loading, signIn, signOut };
}
