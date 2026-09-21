import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiAward, FiCheckCircle, FiArrowRight, FiInfo } from "react-icons/fi";
import { DrawHeader } from "../Component/DrawHeader";
import { PrizePoolSection, type PrizeTier } from "../Component/PrizePool";
import ScoresSection, { type ScoreEntry } from "../Component/ScoresSection";
import { getMyScores } from "../Services/Score.service";
import { getLatestDraw } from "../Services/DrawResult.service";

// --- Flexible API Contracts ---
export interface LatestDrawPrizePool {
  match_type: number;
  percentage?: number;
  pool_amount: number;
  rollover_amount?: number;
}

export interface DrawMatchResult {
  id?: string;
  match_type: number;
  matched_numbers: number[];
  prize_amount: number;
}

export interface UserDrawResultNested {
  has_won?: boolean;
  total_prize?: number;
  matches?: DrawMatchResult[];
}

export interface LatestDrawItem {
  id?: string;
  year?: number;
  month?: number;
  draw_type?: string;
  status: string;
  winning_numbers?: number[];
  published_at?: string | null;
}

export interface LatestDrawApiResponse {
  success?: boolean;
  draw: LatestDrawItem | null;
  prize_pools: LatestDrawPrizePool[];
  // Supports legacy/nested format:
  result?: UserDrawResultNested | null;
  // Supports flat/variant format:
  user_result?: DrawMatchResult | null;
  user_won?: boolean;
  user_prize?: number;
  is_authenticated?: boolean;
}

// Normalized UI view model
interface NormalizedUserResult {
  hasWon: boolean;
  totalPrize: number;
  matches: DrawMatchResult[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SAMPLE_PRIZES: PrizeTier[] = [
  { matchCount: 5, amount: "₹50,000" },
  { matchCount: 4, amount: "₹12,000" },
  { matchCount: 3, amount: "₹2,500" },
];

function formatCurrencyINR(amount: number = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function MonthlyDraw() {
  const navigate = useNavigate();

  // 1. Fetch User Golf Scores
  const {
    data: scores = [],
    isLoading: isScoresLoading,
    isError: isScoresError,
    error: scoresError,
  } = useQuery<ScoreEntry[]>({
    queryKey: ["golf-scores"],
    queryFn: getMyScores,
  });

  // 2. Fetch Latest Draw & Win Evaluation
  const {
    data: latestDrawData,
    isLoading: isDrawLoading,
    isError: isDrawError,
    error: drawError,
  } = useQuery<LatestDrawApiResponse>({
    queryKey: ["latest-draw"],
    queryFn: getLatestDraw,
  });

  const activeDraw = latestDrawData?.draw ?? null;

  // Normalize inconsistent user outcome data schemas
  const userResult = useMemo<NormalizedUserResult>(() => {
    if (!latestDrawData) {
      return { hasWon: false, totalPrize: 0, matches: [] };
    }

    // Format A: Flat structure (user_won, user_prize, user_result)
    if (typeof latestDrawData.user_won === "boolean") {
      const matches = latestDrawData.user_result
        ? [latestDrawData.user_result]
        : [];
      return {
        hasWon: latestDrawData.user_won,
        totalPrize:
          latestDrawData.user_prize ??
          latestDrawData.user_result?.prize_amount ??
          0,
        matches,
      };
    }

    // Format B: Nested structure (result.has_won, result.matches)
    if (latestDrawData.result) {
      return {
        hasWon: Boolean(latestDrawData.result.has_won),
        totalPrize: latestDrawData.result.total_prize ?? 0,
        matches: latestDrawData.result.matches ?? [],
      };
    }

    return { hasWon: false, totalPrize: 0, matches: [] };
  }, [latestDrawData]);

  // Derive display month: Draw month -> Active calendar month fallback
  const currentMonthName = useMemo(() => {
    if (activeDraw?.month && activeDraw.month >= 1 && activeDraw.month <= 12) {
      return MONTH_NAMES[activeDraw.month - 1];
    }
    return MONTH_NAMES[new Date().getMonth()];
  }, [activeDraw?.month]);

  // Map API prize pools to PrizePoolSection tiers
  const dynamicTiers: PrizeTier[] = useMemo(() => {
    if (
      !latestDrawData?.prize_pools ||
      latestDrawData.prize_pools.length === 0
    ) {
      return [];
    }

    return [...latestDrawData.prize_pools]
      .sort((a, b) => b.match_type - a.match_type)
      .map((pool) => ({
        matchCount: pool.match_type,
        amount: formatCurrencyINR(
          pool.pool_amount + (pool.rollover_amount || 0),
        ),
      }));
  }, [latestDrawData?.prize_pools]);

  const isPublished = activeDraw?.status?.toUpperCase() === "PUBLISHED";
  const hasWinningNumbers = Boolean(
    isPublished &&
    activeDraw?.winning_numbers &&
    activeDraw.winning_numbers.length > 0,
  );

  if (isScoresLoading || isDrawLoading) {
    return (
      <div className="mx-auto mt-20 flex max-w-2xl justify-center text-sm text-neutral-400">
        Loading monthly draw details...
      </div>
    );
  }

  if (isScoresError || isDrawError) {
    const errorMsg =
      (scoresError instanceof Error && scoresError.message) ||
      (drawError instanceof Error && drawError.message) ||
      "Failed to load draw data.";
    return (
      <div className="mx-auto mt-20 max-w-2xl rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-sm text-rose-600">
        {errorMsg}
      </div>
    );
  }

  const isEntered = scores.length >= 5;

  return (
    <div className="mx-auto my-22 w-full max-w-2xl space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <DrawHeader monthName={currentMonthName} />

      {/* Case 1: Draw Not Scheduled / In Preparation */}
      {!activeDraw && (
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-4 text-xs text-neutral-600">
          <FiInfo className="h-4 w-4 shrink-0 text-neutral-400" />
          <span>
            The next draw is currently being scheduled. Enter your scores below
            to qualify.
          </span>
        </div>
      )}

      {/* Case 2: Draw Scheduled but Pending Publication */}
      {activeDraw && !isPublished && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200/70 bg-amber-50/40 p-4 text-xs">
          <div className="flex items-center gap-2 font-medium text-amber-900">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {currentMonthName} Draw is currently active. Results will be
              published soon.
            </span>
          </div>
          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] text-amber-800">
            {activeDraw.status.toUpperCase()}
          </span>
        </div>
      )}

      {/* Winning Announcement Banner */}
      {userResult.hasWon && (
        <div className="flex flex-col gap-4 rounded-3xl border border-emerald-500/30 bg-emerald-50/20 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                <FiAward className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-950">
                  Congratulations! You Won!
                </h3>
                <p className="text-xs text-neutral-600">
                  {userResult.matches.length > 0
                    ? userResult.matches
                        .map((m) => `${m.match_type} Match`)
                        .join(", ")
                    : "Winning entry"}{" "}
                  in the {currentMonthName} Draw
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Prize Allocated
              </span>
              <p className="font-mono text-xl font-black text-neutral-950">
                {formatCurrencyINR(userResult.totalPrize)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-emerald-500/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-neutral-500">
              Submit scorecard verification to release your payout.
            </p>
            <button
              type="button"
              onClick={() =>
                navigate("/draws/claim-verification", {
                  state: {
                    drawId: activeDraw?.id,
                    totalPrize: userResult.totalPrize,
                    monthName: currentMonthName,
                  },
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-95 shadow-sm"
            >
              <span>Upload Proof to Claim</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Published Draw Winning Numbers */}
      {hasWinningNumbers && (
        <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Official Winning Numbers
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <FiCheckCircle className="h-3.5 w-3.5" />
              {activeDraw?.status.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeDraw?.winning_numbers?.map((num) => {
              const isMatched = userResult.matches.some((m) =>
                m.matched_numbers?.includes(num),
              );
              return (
                <div
                  key={num}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border font-mono text-sm font-bold shadow-sm transition ${
                    isMatched
                      ? "border-emerald-600 bg-emerald-600 text-white ring-2 ring-emerald-600/30"
                      : "border-neutral-200 bg-white text-neutral-800"
                  }`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scores Section */}
      <ScoresSection scores={scores} isEntered={isEntered} />

      {/* Prize Pools */}
      <PrizePoolSection
        monthName={currentMonthName}
        tiers={dynamicTiers.length > 0 ? dynamicTiers : SAMPLE_PRIZES}
      />
    </div>
  );
}
