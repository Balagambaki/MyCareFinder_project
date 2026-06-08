import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });
    }, []);
    if (loading)
        return _jsx("p", { children: "Loading..." });
    if (!user)
        return _jsx("p", { children: "Access Denied" });
    return children;
}
