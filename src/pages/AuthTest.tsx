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

  return (
    <div style={{ padding: 20 }}>
      <h2>Auth Test</h2>

      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={login}>Login</button>
    </div>
  );
}