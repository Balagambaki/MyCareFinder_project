import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

type Hospital = {
  id: string;
  name: string;
  address?: string;
  specialty?: string;
  ownership?: string;
};

export default function Admin() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    const { data, error } = await supabase
      .from("hospitals")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setHospitals(data || []);
  };

  const deleteHospital = async (id: string) => {
    const confirmDelete = confirm("Delete this hospital?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("hospitals")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadHospitals();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <button
        onClick={() => navigate("/admin/editor")}
        style={{
          padding: 10,
          marginBottom: 20,
          background: "green",
          color: "white",
          border: "none",
          borderRadius: 8,
        }}
      >
        + Add Hospital
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {hospitals.map((h) => (
          <div
            key={h.id}
            style={{
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3>{h.name}</h3>
              <p>{h.address}</p>
              <small>
                {h.specialty} | {h.ownership}
              </small>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => navigate(`/admin/editor?id=${h.id}`)}
                style={{ padding: 6 }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteHospital(h.id)}
                style={{ padding: 6, background: "red", color: "white" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}