import { supabase } from "../Lib/SupaBase";

export const getAdminDashboard = async () => {
  const { data, error } = await supabase.functions.invoke(
    "get-admin-dashboard",
  );

  if (error) {
    throw error;
  }

  return data;
};
