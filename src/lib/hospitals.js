import { supabase } from "./supabaseClient";
export const getHospitals = async () => {
    const { data } = await supabase
        .from("hospitals")
        .select("*")
        .order("is_premium", { ascending: false }); // PREMIUM FIRST
    return data;
};
