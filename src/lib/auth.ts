import { supabase } from "./supabaseClient";

export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const getUserRole = async (userId: string) => {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  return data?.role;
};