import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
export default function AuthTest() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const login = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        console.log("LOGIN RESULT:", data, error);
    };
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsx("h2", { children: "Auth Test" }), _jsx("input", { placeholder: "email", onChange: (e) => setEmail(e.target.value) }), _jsx("input", { placeholder: "password", type: "password", onChange: (e) => setPassword(e.target.value) }), _jsx("button", { onClick: login, children: "Login" })] }));
}
