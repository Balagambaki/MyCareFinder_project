import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    setLoading(true);

    // 1. Create auth user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // 2. Check if user was created
    if (!data.user) {
      alert("Signup failed. Try again.");
      setLoading(false);
      return;
    }

    // 3. Profile is auto-created by DATABASE TRIGGER
    alert("Account created successfully! Please check your email.");

    // 4. Redirect to login page
    navigate("/login");

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <h2>Create Account</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      />

      <button
        onClick={signup}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </div>
  );
}