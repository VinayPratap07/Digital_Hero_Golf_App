import { supabase } from "../Lib/SupaBase";

export const getPendingVerifications = async () => {
  const { data, error } = await supabase.functions.invoke(
    "get-pending-verifications",
    {
      method: "GET",
    },
  );

  if (error) {
    console.error("Get pending verifications error:", error);
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};

export const reviewWinnerVerification = async ({
  verificationId,
  action,
  adminNotes,
}: {
  verificationId: string;
  action: "approve" | "reject";
  adminNotes?: string;
}) => {
  const { data, error } = await supabase.functions.invoke(
    "review-winner-verification",
    {
      method: "POST",
      body: {
        verification_id: verificationId,
        action,
        admin_notes: adminNotes ?? null,
      },
    },
  );

  if (error) {
    console.error("Review winner verification error:", error);
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};
