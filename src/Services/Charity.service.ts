import { supabase } from "../Lib/SupaBase";

export const getAllCharity = async () => {
  const { data, error } = await supabase.from("charities").select("*");

  if (error) {
    console.error("Error fetching charities:", error);
    throw error;
  }

  return data;
};

export const setCharitySelection = async ({
  charity_id,
  contribution_percentage,
}: {
  charity_id: string;
  contribution_percentage: number;
}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/set-charity-selection`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        charity_id,
        contribution_percentage,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to select charity");
  }

  return data;
};

export const getMySubscription = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      id,
      plan,
      status,
      current_period_start,
      current_period_end
    `,
    )
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching subscription:", error);
    throw error;
  }

  return data;
};
