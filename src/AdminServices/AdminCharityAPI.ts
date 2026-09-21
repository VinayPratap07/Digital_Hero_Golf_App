import { supabase } from "../Lib/SupaBase";

export const getAdminCharities = async () => {
  const { data, error } = await supabase.functions.invoke(
    "get-admin-charities",
  );

  if (error) {
    console.error(error);
    throw error;
  }

  return data.charities;
};

export const createCharity = async (charity: {
  name: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  isFeatured?: boolean;
}) => {
  const { data, error } = await supabase.functions.invoke("create-charity", {
    body: charity,
  });

  if (error) {
    throw error;
  }

  return data.charity;
};

export const updateCharity = async (
  charityOrId:
    | string
    | {
        id: string;
        name?: string;
        description?: string;
        image_url?: string;
        is_active?: boolean;
        isFeatured?: boolean;
      },
  maybeData?: {
    name?: string;
    description?: string;
    image_url?: string;
    is_active?: boolean;
    isFeatured?: boolean;
  },
) => {
  const charity =
    typeof charityOrId === "string"
      ? { id: charityOrId, ...maybeData }
      : charityOrId;

  const { data, error } = await supabase.functions.invoke("update-charity", {
    body: charity,
  });

  if (error) {
    throw error;
  }

  return data.charity;
};

export const deleteCharity = async (id: string) => {
  const { data, error } = await supabase.functions.invoke("delete-charity", {
    body: { id },
  });

  if (error) {
    throw error;
  }

  return data;
};
