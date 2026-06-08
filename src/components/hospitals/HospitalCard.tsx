import { Link } from "react-router-dom";

interface Props {
  hospital: {
    id: string;
    name: string;
    city: string;
    lga: string;
    specialties: string[];
    average_rating: number;
    address?: string;
    image_url?: string;
  };
}

export default function HospitalCard({ hospital }: Props) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "14px",
        padding: "14px",
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        transition: "0.2s ease",
      }}
    >
      {/* IMAGE */}
      {hospital.image_url && (
        <img
          src={hospital.image_url}
          alt={hospital.name}
          style={{
            width: "100%",
            height: "140px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        />
      )}

      {/* TITLE */}
      <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
        {hospital.name}
      </h2>

      <p style={{ fontSize: "13px", color: "#666" }}>
        {hospital.address || `${hospital.city}, ${hospital.lga}`}
      </p>

      {/* RATING */}
      <div style={{ marginTop: "6px", fontSize: "13px" }}>
        ⭐ {hospital.average_rating?.toFixed(1) || "0.0"}
      </div>

      {/* SPECIALTIES */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
        {hospital.specialties?.slice(0, 3).map((s) => (
          <span
            key={s}
            style={{
              fontSize: "11px",
              background: "#e6f0ff",
              padding: "3px 8px",
              borderRadius: "20px",
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* LINK */}
      <Link
        to={`/hospital/${hospital.id}`}
        style={{
          display: "inline-block",
          marginTop: "10px",
          color: "#2563eb",
          fontSize: "13px",
          fontWeight: 500,
        }}
      >
        View Details →
      </Link>
    </div>
  );
}