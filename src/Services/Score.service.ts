import { supabase } from "../Lib/SupaBase";

//function to upload user score
export const uploadScore = async (score: number, date: string) => {
  const { data, error } = await supabase.functions.invoke("quick-worker", {
    body: {
      score,
      scoreDate: date,
    },
  });

  if (error) {
    console.error("Error uploading score:", error);
    throw error;
  }

  return data;
};

//function to get user score
export const getMyScores = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("golf_scores")
    .select("*")
    .eq("user_id", user.id)
    .order("score_date", { ascending: false });

  if (error) {
    console.error("Error fetching golf scores:", error);
    throw error;
  }

  return data;
};

export interface UpdateScoreParams {
  scoreId: string;
  score: number;
  date: string;
}

// Function to update user score via Edge Function
export const updateScore = async ({
  scoreId,
  score,
  date,
}: UpdateScoreParams) => {
  const { data, error } = await supabase.functions.invoke("update-golf-score", {
    body: {
      score_id: scoreId,
      score: Number(score),
      score_date: date,
    },
  });

  if (error) {
    console.error("Error updating score:", error);
    throw error;
  }

  // Edge Functions return JSON errors with HTTP status codes which might pass through as data
  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};

// Function to delete user score via Edge Function
export const deleteScore = async (scoreId: string) => {
  const { data, error } = await supabase.functions.invoke("delete-golf-score", {
    body: {
      score_id: scoreId,
    },
  });

  if (error) {
    console.error("Error deleting score:", error);
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};

//User payment service
export const createCheckoutSession = async (plan: "monthly" | "yearly") => {
  const { data, error } = await supabase.functions.invoke(
    "create-checkout-session",
    {
      body: {
        plan,
      },
    },
  );

  if (error) {
    console.error("Checkout error:", error);

    throw error;
  }

  return data;
};
