import { supabase } from "../Lib/SupaBase";

//Supabase function for user signup
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

//Supabase function for user login based on password
export const logIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
  return data;
};

//Supabase funciton to logout user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

//Supabase functin to get Currentuser
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
};

export const authSession = async () => {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return null;
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", data.session.user.id)
    .maybeSingle();

  console.log(subscription);

  return data;
};

export const getMyProfile = async () => {
  const { data, error } = await supabase.functions.invoke("get-my-profile", {
    method: "GET",
  });

  if (error) {
    console.error("Get my profile error:", error);
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};
