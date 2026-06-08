import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}