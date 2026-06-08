import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
export default function Admin() {
    const [hospitals, setHospitals] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        loadHospitals();
    }, []);
    const loadHospitals = async () => {
        const { data, error } = await supabase
            .from("hospitals")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error)
            setHospitals(data || []);
    };
    const deleteHospital = async (id) => {
        const confirmDelete = confirm("Delete this hospital?");
        if (!confirmDelete)
            return;
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
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsx("h1", { children: "Admin Dashboard" }), _jsx("button", { onClick: () => navigate("/admin/editor"), style: {
                    padding: 10,
                    marginBottom: 20,
                    background: "green",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                }, children: "+ Add Hospital" }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: hospitals.map((h) => (_jsxs("div", { style: {
                        padding: 10,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }, children: [_jsxs("div", { children: [_jsx("h3", { children: h.name }), _jsx("p", { children: h.address }), _jsxs("small", { children: [h.specialty, " | ", h.ownership] })] }), _jsxs("div", { style: { display: "flex", gap: 8 }, children: [_jsx("button", { onClick: () => navigate(`/admin/editor?id=${h.id}`), style: { padding: 6 }, children: "Edit" }), _jsx("button", { onClick: () => deleteHospital(h.id), style: { padding: 6, background: "red", color: "white" }, children: "Delete" })] })] }, h.id))) })] }));
}
