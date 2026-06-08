import { supabase } from "./supabaseClient";
export const bookAppointment = async (hospital_id, user_email, date, time) => {
    return await supabase.from("appointments").insert([
        { hospital_id, user_email, date, time },
    ]);
};
