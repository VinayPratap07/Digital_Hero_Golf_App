import { supabase } from "../Lib/SupaBase";

export interface ApiProfile {
  id: string;
  name?: string;
  full_name?: string;
  role: "user" | "admin";
  created_at: string;
  updated_at?: string;
}

export interface ApiSubscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiScoreItem {
  id: string;
  user_id: string;
  score: number;
  score_date?: string;
}

export interface ApiUserItem {
  profile: ApiProfile;
  email: string | null;
  subscription: ApiSubscription | null;
  charity_selection: unknown | null;
  charity: unknown | null;
  charity_contributions: unknown[];
  scores: ApiScoreItem[];
  draw_entries: unknown[];
  wins: unknown[];
  statistics: {
    total_draws_entered: number;
    total_wins: number;
    total_winnings: number;
    total_paid_out: number;
    pending_payout: number;
    golf_scores_count: number;
    charity_contributions_count: number;
  };
}

export interface UpdateUserPayload {
  user_id: string;
  name?: string;
  role?: "user" | "admin";
  email?: string;
}

export const getAdminUsers = async (): Promise<ApiUserItem[]> => {
  const { data, error } = await supabase.functions.invoke("get-admin-users");

  if (error) {
    console.error("Error fetching admin users:", error);
    throw error;
  }

  return data.users ?? [];
};

export const updateAdminUser = async (payload: UpdateUserPayload) => {
  const { data, error } = await supabase.functions.invoke("admin-update-user", {
    body: payload,
  });

  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }

  return data;
};

export const deleteAdminUser = async (user_id: string) => {
  const { data, error } = await supabase.functions.invoke("admin-delete-user", {
    body: { user_id },
  });

  if (error) {
    console.error("Error deleting user:", error);
    throw error;
  }

  return data;
};
