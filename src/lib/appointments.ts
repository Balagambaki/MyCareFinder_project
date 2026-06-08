import { supabase } from "./supabaseClient";

export const bookAppointment = async (
  hospital_id: string,
  user_email: string,
  date: string,
  time: string
) => {
  return await supabase.from("appointments").insert([
    { hospital_id, user_email, date, time },
  ]);
};