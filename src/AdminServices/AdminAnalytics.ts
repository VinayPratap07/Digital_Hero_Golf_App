import { supabase } from "../Lib/SupaBase";

//Admin api call to get all users
export const getAdminAnalytics = async () => {
  const { data, error } = await supabase.functions.invoke(
    "get-admin-analytics",
  );

  if (error) {
    console.error("Error fetching admin users:", error);

    throw error;
  }

  return data.users;
};
