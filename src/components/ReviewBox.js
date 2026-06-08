import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
export default function ReviewBox({ hospitalId }) {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const submitReview = async () => {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user)
            return alert("Login required");
        await supabase.from("reviews").insert({
            hospital_id: hospitalId,
            user_id: user.user.id,
            rating,
            review_text: text,
            approved: false,
        });
        alert("Review submitted for approval");
        setText("");
    };
    return (_jsxs("div", { style: { marginTop: 20 }, children: [_jsx("h3", { children: "Leave a Review" }), _jsx("select", { value: rating, onChange: (e) => setRating(Number(e.target.value)), children: [1, 2, 3, 4, 5].map(r => (_jsxs("option", { value: r, children: [r, " \u2B50"] }, r))) }), _jsx("textarea", { value: text, onChange: (e) => setText(e.target.value), placeholder: "Write review...", style: { width: "100%", marginTop: 10 } }), _jsx("button", { onClick: submitReview, style: { marginTop: 10 }, children: "Submit Review" })] }));
}
