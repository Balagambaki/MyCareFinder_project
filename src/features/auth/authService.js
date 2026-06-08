import { supabase } from "../../lib/supabaseClient";
export const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName }
        }
    });
    return { data, error };
};
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
};
export const signOut = async () => {
    await supabase.auth.signOut();
};
