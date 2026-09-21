import { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiShare2,
  FiPlus,
  FiCheckCircle,
  FiCalendar,
  FiHash,
  FiUsers,
  FiAward,
  FiInfo,
} from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDraw,
  getCurrentDraw,
  simulateDraw,
  publishDraw,
} from "../AdminServices/AdminDrawAPI";

// --- Schema Definitions Matching Real API Payload ---
export interface PrizePoolTier {
  id: string;
  match_type: number;
  percentage: number;
  pool_amount: number;
  rollover_amount: number;
}

export interface SimulationSummary {
  five_match_winners: number;
  four_match_winners: number;
  three_match_winners: number;
  total_winners: number;
}

export interface DrawSimulationData {
  draw_type: string;
  participants: number;
  simulated_at: string;
  summary: SimulationSummary;
  winning_numbers: number[];
  winners?: unknown[];
  prize_pool?: {
    base_pool_amount?: number;
    [key: string]: unknown;
  };
}

export interface ApiDraw {
  id: string;
  year: number;
  month: number;
  status: "draft" | "simulated" | "completed" | "published" | string;
  draw_type: "random" | "algorithmic" | string;
  draw_numbers: number[] | null;
  published_at: string | null;
  created_at: string;
  simulation_data: DrawSimulationData | null;
}

export interface GetCurrentDrawResponse {
  success: boolean;
  role: string;
  requested_period: {
    year: number;
    month: number;
  };
  draw: ApiDraw | null;
  prize_pools: PrizePoolTier[];
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

export default function AdminDrawsPage() {
  const queryClient = useQueryClient();

  // 1. Month Navigation State
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const selectedYear = currentDate.getFullYear();
  const selectedMonth = currentDate.getMonth() + 1;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [drawAmount, setDrawAmount] = useState<string>("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  // 2. Fetch Draw for Current Period
  const {
    data: drawResponse,
    isLoading,
    isError,
  } = useQuery<GetCurrentDrawResponse>({
    queryKey: ["admin-draw", selectedYear, selectedMonth],
    queryFn: () => getCurrentDraw(selectedYear, selectedMonth),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const activeDraw = drawResponse?.draw ?? null;
  const prizePools = drawResponse?.prize_pools ?? [];

  // Reset or prefill draw amount when switching period or when simulation data loads
  useEffect(() => {
    if (activeDraw?.simulation_data?.prize_pool?.base_pool_amount) {
      setDrawAmount(
        String(activeDraw.simulation_data.prize_pool.base_pool_amount),
      );
    } else {
      setDrawAmount("");
    }
  }, [selectedYear, selectedMonth, activeDraw?.simulation_data]);

  // Derived display numbers: checks activeDraw.draw_numbers first, falls back to simulation_data.winning_numbers
  const displayWinningNumbers =
    activeDraw?.draw_numbers && activeDraw.draw_numbers.length > 0
      ? activeDraw.draw_numbers
      : activeDraw?.simulation_data?.winning_numbers &&
          activeDraw.simulation_data.winning_numbers.length > 0
        ? activeDraw.simulation_data.winning_numbers
        : null;

  // Derived validation state
  const parsedDrawAmount = parseFloat(drawAmount);
  const isAmountValid = !Number.isNaN(parsedDrawAmount) && parsedDrawAmount > 0;

  // 3. Mutations
  const createMutation = useMutation({
    mutationFn: () => createDraw({ year: selectedYear, month: selectedMonth }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-draw", selectedYear, selectedMonth],
      });
      showToast("Draw created successfully.");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to create draw.";
      showToast(msg);
    },
  });

  const simulateMutation = useMutation({
    mutationFn: (drawId: string) => simulateDraw(drawId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-draw", selectedYear, selectedMonth],
      });
      showToast("Draw simulated successfully.");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to simulate draw.";
      showToast(msg);
    },
  });

  const publishMutation = useMutation({
    mutationFn: (drawId: string) => {
      if (!isAmountValid) {
        throw new Error("Enter a valid draw amount before publishing.");
      }
      return publishDraw(drawId, parsedDrawAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-draw", selectedYear, selectedMonth],
      });
      showToast("Results published successfully.");
      setDrawAmount("");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to publish results.";
      showToast(msg);
    },
  });

  const totalPrizePool = prizePools.reduce((acc, p) => acc + p.pool_amount, 0);
  const totalRollover = prizePools.reduce(
    (acc, p) => acc + p.rollover_amount,
    0,
  );
  const isAllZeroPool = totalPrizePool === 0;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-neutral-900/95 px-4 py-3 text-sm font-semibold text-emerald-400 shadow-2xl backdrop-blur-md animate-in fade-in">
          <FiCheckCircle className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Date Navigation */}
      <div className="flex flex-col gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Draw Management
          </h1>
          <p className="text-sm text-neutral-400">
            Configure draw schedules, execute probability simulations, and
            publish prizes.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-1.5 backdrop-blur-sm">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
            aria-label="Previous Month"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 px-3 text-sm font-bold text-white">
            <FiCalendar className="h-4 w-4 text-neutral-400" />
            <span>
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </span>
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
            aria-label="Next Month"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex h-72 items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900/30 text-sm text-neutral-400">
          Loading draw details...
        </div>
      ) : isError ? (
        <div className="flex h-72 items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900/30 text-sm text-red-400">
          Failed to fetch draw details. Check server connection.
        </div>
      ) : !activeDraw ? (
        /* Empty State: Create Draw */
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-neutral-800 bg-neutral-900/20 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-400">
            <FiCalendar className="h-6 w-6" />
          </div>
          <div className="max-w-md">
            <h3 className="text-lg font-bold text-white">
              No Draw Found for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              There is currently no draw recorded for this month. Initialize one
              to start registering participants and running simulations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-neutral-950 transition hover:bg-neutral-200 active:scale-95 disabled:opacity-50"
          >
            <FiPlus className="h-4 w-4" />
            <span>
              {createMutation.isPending ? "Creating Draw..." : "Create Draw"}
            </span>
          </button>
        </div>
      ) : (
        /* Active Draw View */
        <div className="space-y-6">
          <div className="space-y-6 rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm md:p-8">
            {/* Top Bar: IDs & Status Badges */}
            <div className="flex flex-col gap-3 border-b border-neutral-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Draw ID: {activeDraw.id}
                </span>
                <h2 className="mt-1 text-xl font-bold text-white">
                  {MONTH_NAMES[activeDraw.month - 1]} {activeDraw.year} Draw
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                    activeDraw.status === "published"
                      ? "border-sky-500/20 bg-sky-500/10 text-sky-400"
                      : activeDraw.status === "simulated"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : activeDraw.status === "completed"
                          ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                          : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {activeDraw.status.toUpperCase()}
                </span>
                <span className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 font-mono text-xs text-neutral-400">
                  Type: {activeDraw.draw_type}
                </span>
              </div>
            </div>

            {/* Target Drawn Numbers */}
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Winning Numbers
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {displayWinningNumbers ? (
                  displayWinningNumbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-950 font-mono text-base font-bold text-white shadow-inner"
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500">
                    Numbers not drawn yet. They will generate upon simulation.
                  </p>
                )}
              </div>
            </div>

            {/* Prize Pools */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Prize Pools
                </span>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  {totalRollover > 0 && (
                    <span className="text-amber-400">
                      Rollover: ₹{totalRollover.toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="text-neutral-400">
                    Total: ₹{totalPrizePool.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {isAllZeroPool && (
                <div className="mb-3 flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
                  <FiInfo className="h-4 w-4 shrink-0" />
                  <span>
                    Prize pool amounts are currently ₹0. Pool amounts will
                    finalize once subscription allocations process.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {prizePools.map((tier) => (
                  <div
                    key={tier.id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4"
                  >
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-bold uppercase">
                        {tier.match_type} Match Tier
                      </span>
                      <span className="font-mono font-semibold text-white">
                        {tier.percentage}%
                      </span>
                    </div>
                    <p className="mt-2 text-lg font-bold text-white">
                      ₹{tier.pool_amount.toLocaleString("en-IN")}
                    </p>
                    {tier.rollover_amount > 0 && (
                      <span className="mt-1 block text-[11px] font-medium text-amber-400">
                        +₹{tier.rollover_amount.toLocaleString("en-IN")}{" "}
                        Rollover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Simulation Results Preview */}
            {activeDraw.simulation_data && (
              <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <FiHash className="h-3.5 w-3.5" /> Simulation Results
                    Summary
                  </span>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <FiUsers className="h-3.5 w-3.5 text-neutral-500" />
                      {activeDraw.simulation_data.participants ?? 0} Tickets
                      Evaluated
                    </span>
                    <span className="flex items-center gap-1">
                      <FiAward className="h-3.5 w-3.5 text-neutral-500" />
                      {activeDraw.simulation_data.summary?.total_winners ??
                        0}{" "}
                      Total Winners
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3">
                    <span className="block text-neutral-500">
                      5 Match Winners
                    </span>
                    <span className="mt-1 block text-base font-bold text-white">
                      {activeDraw.simulation_data.summary?.five_match_winners ??
                        0}
                    </span>
                  </div>
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3">
                    <span className="block text-neutral-500">
                      4 Match Winners
                    </span>
                    <span className="mt-1 block text-base font-bold text-white">
                      {activeDraw.simulation_data.summary?.four_match_winners ??
                        0}
                    </span>
                  </div>
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3">
                    <span className="block text-neutral-500">
                      3 Match Winners
                    </span>
                    <span className="mt-1 block text-base font-bold text-white">
                      {activeDraw.simulation_data.summary
                        ?.three_match_winners ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Execution Controls */}
            <div className="flex flex-col gap-4 border-t border-neutral-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => simulateMutation.mutate(activeDraw.id)}
                disabled={
                  simulateMutation.isPending ||
                  activeDraw.status === "published"
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiPlay className="h-3.5 w-3.5" />
                <span>
                  {simulateMutation.isPending
                    ? "Running Simulation..."
                    : activeDraw.simulation_data
                      ? "Re-run Simulation"
                      : "Run Simulation"}
                </span>
              </button>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {activeDraw.status !== "published" && (
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-neutral-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Draw amount..."
                      value={drawAmount}
                      onChange={(e) => setDrawAmount(e.target.value)}
                      disabled={
                        publishMutation.isPending || !activeDraw.simulation_data
                      }
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-7 pr-3 text-xs font-medium text-white placeholder-neutral-500 outline-none transition focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-44"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => publishMutation.mutate(activeDraw.id)}
                  disabled={
                    publishMutation.isPending ||
                    activeDraw.status === "published" ||
                    !activeDraw.simulation_data ||
                    !isAmountValid
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-neutral-950 transition hover:bg-neutral-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiShare2 className="h-3.5 w-3.5" />
                  <span>
                    {publishMutation.isPending
                      ? "Publishing..."
                      : activeDraw.status === "published"
                        ? "Results Published"
                        : "Publish Results"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
