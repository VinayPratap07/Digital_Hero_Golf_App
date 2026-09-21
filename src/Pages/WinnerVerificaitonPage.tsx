import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiLink,
  FiAlertTriangle,
  FiArrowLeft,
  FiShield,
  FiFileText,
  FiAlertOctagon,
  FiExternalLink,
  FiCheckCircle,
} from "react-icons/fi";
import { submitWinnerVerification } from "../Services/DrawResult.service";

interface ClaimState {
  drawResultId?: string;
  totalPrize?: number;
  monthName?: string;
}

export default function WinnerClaimVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const state = (location.state as ClaimState) || {};
  const drawResultId = state.drawResultId || "";
  const totalPrize = state.totalPrize || 0;
  const monthName = state.monthName || "Latest";

  // Form states
  const [driveUrl, setDriveUrl] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Link validation helper
  const isValidGoogleDriveUrl = (url: string) => {
    return (
      url.includes("drive.google.com/file/d/") ||
      url.includes("drive.google.com/open?id=") ||
      url.includes("drive.google.com/uc?id=") ||
      url.includes("drive.google.com/drive/folders/")
    );
  };

  // Submit claim mutation
  const claimMutation = useMutation({
    mutationFn: async () => {
      const trimmedUrl = driveUrl.trim();

      if (!trimmedUrl) {
        throw new Error("Please enter your Google Drive image link.");
      }

      if (!isValidGoogleDriveUrl(trimmedUrl)) {
        throw new Error(
          "Invalid link. Please provide a valid Google Drive file or image link (e.g. drive.google.com/file/d/...).",
        );
      }

      if (!drawResultId) {
        throw new Error(
          "Missing winning record ID. Please return and re-enter.",
        );
      }

      return await submitWinnerVerification({
        drawResultId,
        proofUrl: trimmedUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latest-draw"] });
      alert(
        "Verification proof submitted successfully. Payout is under review.",
      );
      navigate("/draws");
    },
    onError: (err: unknown) => {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to submit verification link.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreedToTerms) {
      setErrorMessage(
        "You must agree to the verification and anti-fraud terms.",
      );
      return;
    }

    claimMutation.mutate();
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-2xl space-y-6 px-4 pb-16">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 transition hover:text-neutral-900"
      >
        <FiArrowLeft className="h-4 w-4" /> Back to Monthly Draw
      </button>

      <div className="space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="border-b border-neutral-100 pb-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <FiShield className="h-4 w-4" /> Winner Verification
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
            Claim Prize Payout
          </h1>
          <p className="mt-1 text-xs text-neutral-500">
            Provide a publicly accessible Google Drive link to your verified
            scorecard image for the {monthName} draw (Prize:{" "}
            <span className="font-semibold text-neutral-900">
              ₹{totalPrize.toLocaleString("en-IN")}
            </span>
            ).
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-medium text-rose-600">
            <FiAlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Google Drive Link Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
              Google Drive Proof Link *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                placeholder="https://drive.google.com/file/d/your-file-id/view?usp=sharing"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-10 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
              <FiLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              {driveUrl && isValidGoogleDriveUrl(driveUrl) && (
                <FiCheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
              )}
            </div>

            {/* Helper Notice for Sharing Settings */}
            <div className="flex items-start gap-2 rounded-xl bg-neutral-50 p-3 text-[11px] text-neutral-600 border border-neutral-200/60">
              <FiExternalLink className="h-3.5 w-3.5 mt-0.5 shrink-0 text-neutral-400" />
              <p>
                Ensure file link sharing is set to{" "}
                <span className="font-semibold text-neutral-900">
                  &quot;Anyone with the link can view&quot;
                </span>{" "}
                in Google Drive. If our auditors cannot open the image,
                verification will be rejected.
              </p>
            </div>
          </div>

          {/* Anti-Fraud Banner */}
          <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4">
            <div className="flex gap-3">
              <FiAlertOctagon className="h-5 w-5 shrink-0 text-rose-600" />
              <div className="space-y-1 text-xs text-rose-900">
                <p className="font-bold uppercase tracking-wider">
                  Anti-Fraud & Verification Policy
                </p>
                <p className="text-[11px] leading-relaxed text-rose-700">
                  Submitting forged documents, doctored photos, or links to
                  images not belonging to you will result in an immediate
                  permanent account ban and forfeiture of all platform funds.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions Accordion */}
          <div className="space-y-3 rounded-2xl border border-neutral-200/80 bg-neutral-50/40 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700">
              <FiFileText className="h-4 w-4" /> Claim Requirements
            </div>
            <ul className="list-disc space-y-1.5 pl-4 text-[11px] text-neutral-600">
              <li>
                Scorecard image must clearly show hole-by-hole scores, player
                name, and date.
              </li>
              <li>
                Verification audits conclude within 24 to 48 hours of link
                submission.
              </li>
              <li>
                Keep the file accessible on Google Drive until the payout is
                completed.
              </li>
            </ul>

            <label className="mt-3 flex cursor-pointer items-start gap-3 border-t border-neutral-200/60 pt-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span className="text-xs font-medium text-neutral-800">
                I certify that this Google Drive link points to my authentic
                scorecard. I understand submitting fake proof results in a
                permanent ban.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={claimMutation.isPending}
              className="rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                claimMutation.isPending || !driveUrl.trim() || !agreedToTerms
              }
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {claimMutation.isPending
                ? "Submitting Link..."
                : "Submit Proof Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
