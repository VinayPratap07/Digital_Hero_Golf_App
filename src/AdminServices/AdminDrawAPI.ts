import { supabase } from "../Lib/SupaBase";

export const createDraw = async ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const { data, error } = await supabase.functions.invoke("create-draw", {
    method: "POST",
    body: { year, month },
  });

  if (error) {
    console.error("Create draw error:", error);
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  console.log(data);

  return data;
};

export const getCurrentDraw = async (year: number, month: number) => {
  const { data, error } = await supabase.functions.invoke(
    `get-current-draw?year=${year}&month=${month}`,
    {
      method: "GET",
    },
  );

  if (error) {
    throw error;
  }
  console.log(data);
  return data;
};

export const simulateDraw = async (drawId: string) => {
  const { data, error } = await supabase.functions.invoke("simulate-draw", {
    method: "POST",
    body: {
      draw_id: drawId,
    },
  });

  if (error) {
    console.error("Simulate draw error:", error);
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};

export const publishDraw = async (drawId: string, basePoolAmount: number) => {
  const { data, error } = await supabase.functions.invoke("publish-draw", {
    method: "POST",
    body: {
      draw_id: drawId,
      base_pool_amount: basePoolAmount,
    },
  });

  if (error) {
    console.error("Publish draw error:", error);
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};
