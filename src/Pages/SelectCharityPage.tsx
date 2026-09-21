import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiHeart,
  FiCheck,
  FiAlertCircle,
  FiPercent,
  FiArrowRight,
} from "react-icons/fi";
import {
  getAllCharity,
  setCharitySelection,
} from "../Services/Charity.service";
import { Link, useNavigate } from "react-router-dom";

export interface Charity {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
}

interface CharitySelectionProps {
  initialCharityId?: string;
  initialPercentage?: number;
  onSuccessCallback?: () => void;
  isPageWrapper?: boolean; // Set true when rendered at route /select-charity
}

export default function CharitySelector({
  initialCharityId,
  initialPercentage = 10,
  onSuccessCallback,
  isPageWrapper = true,
}: CharitySelectionProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Enforce the platform minimum of 10%
  const startingPercentage = Math.max(initialPercentage, 10);

  const [selectedCharityId, setSelectedCharityId] = useState<string | null>(
    initialCharityId || null,
  );
  const [percentage, setPercentage] = useState<number>(startingPercentage);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // 1. Fetch available charities
  const {
    data: charities = [],
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Charity[]>({
    queryKey: ["charities-list"],
    queryFn: getAllCharity,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Submit selection mutation
  const mutation = useMutation({
    mutationFn: setCharitySelection,
    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Charity preference saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      onSuccessCallback?.();
      navigate("/");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to set charity preference.";
      setFeedback({ type: "error", message: msg });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharityId) {
      setFeedback({
        type: "error",
        message: "Please select a foundation to support before proceeding.",
      });
      return;
    }

    setFeedback(null);
    mutation.mutate({
      charity_id: selectedCharityId,
      contribution_percentage: percentage,
    });
  };

  const content = (
    <div className="w-full max-w-4xl mx-auto my-auto py-6">
      <div className="relative rounded-[2rem] border-2 border-black bg-white p-6 sm:p-10 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        {/* Brand Badge */}
        <div className="absolute -top-3.5 left-8 bg-black text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span>★</span>
          <span>Purpose-Driven Performance</span>
        </div>

        {/* Header Block */}
        <div className="border-b border-neutral-200 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Choose your impact partner.
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
            Every point logged directs real funding to verified charities.
            Select the foundation you want to back with your monthly
            allocations.
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mb-6 flex items-center gap-2.5 rounded-xl border p-3.5 text-xs font-semibold ${
              feedback.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {feedback.type === "success" ? (
              <FiCheck className="h-4 w-4 shrink-0 text-emerald-600 stroke-[3]" />
            ) : (
              <FiAlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex h-56 items-center justify-center rounded-2xl border border-neutral-200 bg-[#f7f9f7] text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Loading verified partners...
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
            <FiAlertCircle className="h-5 w-5" />
            <span>
              {queryError instanceof Error
                ? queryError.message
                : "Failed to load charities."}
            </span>
          </div>
        )}

        {/* Form Body */}
        {!isLoading && !isError && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Charity Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Verified Foundations ({charities.length})
                </span>
                <span className="text-[11px] font-medium text-neutral-400">
                  Select one
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {charities.map((charity) => {
                  const isSelected = selectedCharityId === charity.id;

                  return (
                    <div
                      key={charity.id}
                      onClick={() => setSelectedCharityId(charity.id)}
                      className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border-2 p-4.5 transition-all ${
                        isSelected
                          ? "border-black bg-[#f7f9f7] shadow-sm"
                          : "border-neutral-200 bg-white hover:border-neutral-400"
                      }`}
                    >
                      {/* Image / Thumbnail */}
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white flex items-center justify-center">
                        {charity.image_url ? (
                          <img
                            src={charity.image_url}
                            alt={charity.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-neutral-100">
                            <FiHeart className="h-5 w-5 text-neutral-400" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-bold text-neutral-950">
                            {charity.name}
                          </span>
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-black bg-black text-white"
                                : "border-neutral-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <FiCheck className="h-2.5 w-2.5 stroke-[3]" />
                            )}
                          </div>
                        </div>
                        {charity.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-neutral-500 leading-relaxed">
                            {charity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Allocation Slider Card */}
            <div className="rounded-2xl border border-neutral-200 bg-[#f7f9f7] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Direct Allocation Percentage
                  </span>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Guaranteed minimum 10% pledge from your membership draw
                    pool.
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-black bg-black px-3.5 py-1.5 font-mono text-sm font-extrabold text-white">
                  <span>{percentage}</span>
                  <FiPercent className="text-xs" />
                </div>
              </div>

              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-black"
              />

              <div className="flex justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <span>Minimum (10%)</span>
                <span>Balanced (25%)</span>
                <span>Generous (50%)</span>
                <span>Maximum (100%)</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2 border-t border-neutral-100">
              <span className="text-xs text-neutral-500">
                You can adjust your pledge distribution anytime from your
                profile.
              </span>
              <button
                type="submit"
                disabled={mutation.isPending || !selectedCharityId}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-xs font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>
                  {mutation.isPending
                    ? "Saving..."
                    : "Confirm & Enter Platform"}
                </span>
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  if (!isPageWrapper) {
    return content;
  }

  return (
    <main className="min-h-screen w-full bg-[#edf2ee] text-neutral-900 flex flex-col justify-between p-4 sm:p-8 antialiased selection:bg-neutral-900 selection:text-white">
      {/* Brand Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-xs font-black text-white">
            D
          </div>
          <span className="text-[15px] font-bold tracking-tight text-neutral-900">
            Digital Heroes
          </span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 bg-white/70 border border-neutral-200 px-3 py-1 rounded-full">
          Step 2 of 2
        </span>
      </header>

      {content}

      <footer className="text-center text-xs text-neutral-400 py-2">
        © {new Date().getFullYear()} Digital Heroes. All rights reserved.
      </footer>
    </main>
  );
}
