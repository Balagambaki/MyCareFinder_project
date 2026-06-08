import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const register = async () => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            alert(error.message);
        }
        else {
            alert("Check your email to confirm account");
        }
    };
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsx("h2", { children: "Register" }), _jsx("input", { placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), style: { display: "block", marginBottom: 10, padding: 10 } }), _jsx("input", { placeholder: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), style: { display: "block", marginBottom: 10, padding: 10 } }), _jsx("button", { onClick: register, style: { padding: 10 }, children: "Sign Up" })] }));
}
