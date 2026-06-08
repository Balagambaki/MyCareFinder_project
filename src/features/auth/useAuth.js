import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("user");
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            const currentUser = data.user;
            setUser(currentUser);
            if (currentUser) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", currentUser.id)
                    .single();
                setRole(profile?.role || "user");
            }
            setLoading(false);
        };
        getUser();
        const { data: listener } = supabase.auth.onAuthStateChange(() => {
            getUser();
        });
        return () => listener.subscription.unsubscribe();
    }, []);
    return { user, role, loading };
}
