import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export default function HospitalCard({ hospital }) {
    return (_jsxs("div", { style: {
            border: "1px solid #eee",
            borderRadius: "14px",
            padding: "14px",
            background: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            transition: "0.2s ease",
        }, children: [hospital.image_url && (_jsx("img", { src: hospital.image_url, alt: hospital.name, style: {
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                } })), _jsx("h2", { style: { fontSize: "16px", fontWeight: 600 }, children: hospital.name }), _jsx("p", { style: { fontSize: "13px", color: "#666" }, children: hospital.address || `${hospital.city}, ${hospital.lga}` }), _jsxs("div", { style: { marginTop: "6px", fontSize: "13px" }, children: ["\u2B50 ", hospital.average_rating?.toFixed(1) || "0.0"] }), _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }, children: hospital.specialties?.slice(0, 3).map((s) => (_jsx("span", { style: {
                        fontSize: "11px",
                        background: "#e6f0ff",
                        padding: "3px 8px",
                        borderRadius: "20px",
                    }, children: s }, s))) }), _jsx(Link, { to: `/hospital/${hospital.id}`, style: {
                    display: "inline-block",
                    marginTop: "10px",
                    color: "#2563eb",
                    fontSize: "13px",
                    fontWeight: 500,
                }, children: "View Details \u2192" })] }));
}
