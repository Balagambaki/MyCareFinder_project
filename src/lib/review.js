import { supabase } from "./supabaseClient";
export const createReview = async (data) => {
    const user = await supabase.auth.getUser();
    return supabase.from("reviews").insert([
        {
            ...data,
            user_id: user.data.user?.id,
            approved: false,
        },
    ]);
};
