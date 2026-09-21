import { supabase } from "../Lib/SupaBase";

export const getLatestDraw = async () => {
  const { data, error } = await supabase.functions.invoke("get-latest-draw");

  if (error) {
    console.error("Error fetching latest draw:", error);
    throw error;
  }

  return data;
};

export const submitWinnerVerification = async ({
  drawResultId,
  proofUrl,
}: {
  drawResultId: string;
  proofUrl: string;
}) => {
  const { data, error } = await supabase.functions.invoke(
    "submit-winner-verification",
    {
      method: "POST",
      body: {
        draw_result_id: drawResultId,
        proof_url: proofUrl,
      },
    },
  );

  if (error) {
    console.error("Submit winner verification error:", error);
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};
