import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import HospitalMap from "../components/map/HospitalMap";
import MDEditor from "@uiw/react-md-editor";
export default function HospitalDetail() {
    const { id } = useParams();
    const [hospital, setHospital] = useState(null);
    // reviews
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);
    // ======================
    // LOAD HOSPITAL
    // ======================
    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("hospitals")
                .select("*")
                .eq("id", id)
                .single();
            if (error) {
                console.error(error);
                return;
            }
            setHospital(data);
        }
        load();
    }, [id]);
    // ======================
    // LOAD REVIEWS
    // ======================
    const loadReviews = async () => {
        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .eq("hospital_id", id)
            .eq("approved", true);
        if (!error)
            setReviews(data || []);
    };
    useEffect(() => {
        loadReviews();
    }, [id]);
    // ======================
    // SUBMIT REVIEW
    // ======================
    const submitReview = async () => {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (!user) {
            alert("Please login to review");
            return;
        }
        const { error } = await supabase.from("reviews").insert({
            hospital_id: id,
            user_id: user.id,
            rating,
            review_text: comment,
            approved: true,
        });
        if (error) {
            alert(error.message);
            return;
        }
        setComment("");
        setRating(5);
        loadReviews();
    };
    if (!hospital)
        return _jsx("p", { children: "Loading..." });
    return (_jsxs("div", { style: { padding: 20, maxWidth: 900, margin: "auto" }, children: [_jsx("h1", { children: hospital.name }), _jsx("p", { children: hospital.address }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }, children: [_jsxs("div", { children: [_jsx("h3", { children: "\uD83C\uDFE5 Details" }), _jsxs("p", { children: [_jsx("b", { children: "Specialty:" }), " ", hospital.specialty || "Not specified"] }), _jsxs("p", { children: [_jsx("b", { children: "Ownership:" }), " ", hospital.ownership || "Not specified"] }), _jsxs("p", { children: [_jsx("b", { children: "Working Hours:" }), " ", hospital.working_hours || "Not available"] })] }), _jsxs("div", { children: [_jsx("h3", { children: "\uD83D\uDCDE Contact" }), _jsxs("p", { children: [_jsx("b", { children: "Phone:" }), " ", hospital.phone || "Not available"] }), _jsxs("p", { children: [_jsx("b", { children: "Email:" }), " ", hospital.email || "Not available"] })] })] }), hospital.description && (_jsxs("div", { style: { marginTop: 20 }, children: [_jsx("h3", { children: "\uD83D\uDCDD About" }), _jsx(MDEditor.Markdown, { source: hospital.description })] })), _jsx("div", { style: { height: 300, marginTop: 20 }, children: _jsx(HospitalMap, { hospitals: [hospital], selectedHospital: hospital }) }), _jsxs("div", { style: { marginTop: 30 }, children: [_jsx("h3", { children: "\u2B50 Reviews" }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [_jsxs("select", { value: rating, onChange: (e) => setRating(Number(e.target.value)), children: [_jsx("option", { value: 5, children: "5 \u2B50" }), _jsx("option", { value: 4, children: "4 \u2B50" }), _jsx("option", { value: 3, children: "3 \u2B50" }), _jsx("option", { value: 2, children: "2 \u2B50" }), _jsx("option", { value: 1, children: "1 \u2B50" })] }), _jsx("textarea", { placeholder: "Write your review...", value: comment, onChange: (e) => setComment(e.target.value), style: { padding: 10, minHeight: 80 } }), _jsx("button", { onClick: submitReview, children: "Submit Review" })] }), _jsx("div", { style: { marginTop: 20 }, children: reviews.map((r) => (_jsxs("div", { style: {
                                borderBottom: "1px solid #ddd",
                                padding: 10,
                            }, children: [_jsxs("p", { children: ["\u2B50 ", r.rating] }), _jsx("p", { children: r.review_text })] }, r.id))) })] })] }));
}
