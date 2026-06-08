import { supabase } from "../lib/supabaseClient";
// ➕ Add review
export const addReview = async (hospital_id, user_id, rating, review_text) => {
    return await supabase.from("reviews").insert([
        {
            hospital_id,
            user_id,
            rating,
            review_text,
            approved: false, // admin approval flow
        },
    ]);
};
// 📥 Get approved reviews only
export const getReviews = async (hospital_id) => {
    return await supabase
        .from("reviews")
        .select("*")
        .eq("hospital_id", hospital_id)
        .eq("approved", true)
        .order("created_at", { ascending: false });
};
