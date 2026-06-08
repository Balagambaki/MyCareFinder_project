import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
const pageStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #064e3b)",
    position: "relative",
    fontFamily: "Arial",
};
const brandStyle = {
    position: "absolute",
    top: 20,
    left: 20,
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
};
const cardStyle = {
    width: "320px",
    padding: "25px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};
const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
};
const buttonStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
};
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    // =========================
    // LOGIN FUNCTION
    // =========================
    const login = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }
        const user = data.user;
        if (!user) {
            alert("Login failed");
            setLoading(false);
            return;
        }
        // 🔥 SAFE PROFILE FETCH (no crash if missing)
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .maybeSingle();
        // If no profile, fallback safely
        const role = profile?.role || "user";
        console.log("Logged in:", profile?.full_name, role);
        if (role === "admin") {
            window.location.replace("/admin");
        }
        else {
            window.location.replace("/");
        }
        setLoading(false);
    };
    // =========================
    // REGISTER FUNCTION
    // =========================
    const register = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }
        alert("Account created! Please check your email to verify.");
        setLoading(false);
    };
    return (_jsxs("div", { style: pageStyle, children: [_jsx("div", { style: brandStyle, children: "CareFinder" }), _jsxs("div", { style: cardStyle, children: [_jsx("h2", { children: "Login" }), _jsx("input", { placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), style: inputStyle }), _jsx("input", { placeholder: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), style: inputStyle }), _jsx("button", { onClick: login, style: buttonStyle, disabled: loading, children: loading ? "Processing..." : "Sign In" }), _jsx("button", { onClick: register, style: {
                            ...buttonStyle,
                            background: "#16a34a",
                        }, disabled: loading, children: "Create Account" })] })] }));
}
