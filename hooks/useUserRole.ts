import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export type UserRole = "candidate" | "recruiter" | "admin";

export function useUserRole() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchRole() {
            try {
                setLoading(true);
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

                if (authError) throw authError;

                if (!authUser) {
                    if (isMounted) {
                        setUser(null);
                        setRole(null);
                        setLoading(false);
                    }
                    return;
                }

                if (isMounted) {
                    setUser(authUser);
                }

                // Query role from users table
                const { data: userData, error: dbError } = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", authUser.id)
                    .single();

                if (dbError) throw dbError;

                if (isMounted) {
                    setRole(userData?.role as UserRole | null);
                }
            } catch (err: any) {
                console.error("Error in useUserRole:", err);
                if (isMounted) {
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchRole();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === "SIGNED_OUT") {
                    if (isMounted) {
                        setUser(null);
                        setRole(null);
                        setLoading(false);
                    }
                } else if (event === "SIGNED_IN" && session?.user) {
                    fetchRole();
                }
            }
        );

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return { role, user, loading, error };
}
