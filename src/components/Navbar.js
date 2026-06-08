import { jsx as _jsx } from "react/jsx-runtime";
import { supabase } from "../lib/supabaseClient";
export default function Navbar() {
    const logout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };
    return (_jsx("div", { children: _jsx("button", { onClick: logout, children: "Logout" }) }));
}
