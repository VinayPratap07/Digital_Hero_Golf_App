import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiExternalLink,
  FiCheck,
  FiX,
  FiUser,
  FiAward,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiInbox,
  FiList,
  FiMail,
} from "react-icons/fi";
import {
  getPendingVerifications,
  reviewWinnerVerification,
} from "../AdminServices/AdminVerificationAPI";

// --- Types ---
export interface VerificationMatchResult {
  match_type: number;
  matched_numbers: number[];
  prize_amount: number;
}

export interface VerificationUser {
  id: string;
  full_name: string;
  email: string;
}

export interface VerificationDraw {
  year: number;
  month: number;
  status: string;
}

export interface WinnerVerificationItem {
  id: string;
  draw_result_id: string;
  proof_url?: string | null;
  status: "pending" | "approved" | "rejected" | "unclaimed" | string;
  result: VerificationMatchResult;
  user: VerificationUser;
  draw: VerificationDraw;
}

export interface VerificationResponse {
  success: boolean;
  count: number;
  verifications: WinnerVerificationItem[];
}

function formatCurrencyINR(amount: number = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminVerificationsHubPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "unclaimed">(
    "pending",
  );
  const [activeProcessingId, setActiveProcessingId] = useState<string | null>(
    null,
  );
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // 1. Fetch All Verifications / Winner Results
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<VerificationResponse>({
    queryKey: ["pending-verifications"],
    queryFn: getPendingVerifications,
    refetchOnWindowFocus: false,
  });

  const allItems = response?.verifications ?? [];

  // Split items: Those with submitted proofs vs. those with no proof uploaded yet
  const pendingAudits = allItems.filter(
    (item) => item.status === "pending" && Boolean(item.proof_url),
  );

  const unclaimedWinners = allItems.filter(
    (item) => !item.proof_url || item.status === "unclaimed",
  );

  // 2. Review Decision Mutation
  const reviewMutation = useMutation({
    mutationFn: reviewWinnerVerification,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pending-verifications"] });
      setFeedback({
        type: "success",
        message: `Claim ${variables.action === "approve" ? "approved" : "rejected"} successfully.`,
      });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: (err: unknown) => {
      setFeedback({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to review verification.",
      });
    },
    onSettled: () => {
      setActiveProcessingId(null);
    },
  });

  const handleApprove = (verificationId: string) => {
    if (window.confirm("Approve this claim and authorize the prize payout?")) {
      setActiveProcessingId(verificationId);
      reviewMutation.mutate({ verificationId, action: "approve" });
    }
  };

  const handleReject = (verificationId: string) => {
    const adminNotes =
      window.prompt("Reason for rejection (optional):") ?? undefined;
    setActiveProcessingId(verificationId);
    reviewMutation.mutate({ verificationId, action: "reject", adminNotes });
  };

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900/30 text-sm text-neutral-400">
        Loading winner verification hub...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-3 rounded-3xl border border-neutral-800 bg-neutral-900/30 text-sm text-rose-400">
        <FiAlertCircle className="h-6 w-6 text-rose-500" />
        <p>
          {error instanceof Error
            ? error.message
            : "Failed to load verifications."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Winner Verifications & Claims
          </h1>
          <p className="text-sm text-neutral-400">
            Review submitted scorecard proofs and monitor remaining unclaimed
            winner payouts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-300 transition hover:border-neutral-700 hover:text-white disabled:opacity-50"
        >
          <FiRefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800">
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`relative inline-flex items-center gap-2 pb-3.5 pt-1 text-xs font-bold uppercase tracking-wider transition ${
            activeTab === "pending"
              ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <FiInbox className="h-4 w-4" />
          <span>Pending Audit</span>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 border border-amber-500/20">
            {pendingAudits.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("unclaimed")}
          className={`relative inline-flex items-center gap-2 pb-3.5 pt-1 text-xs font-bold uppercase tracking-wider transition ${
            activeTab === "unclaimed"
              ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <FiList className="h-4 w-4" />
          <span>Awaiting Claim Proof</span>
          <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400 border border-neutral-700">
            {unclaimedWinners.length}
          </span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold ${
            feedback.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-rose-500/20 bg-rose-500/10 text-rose-400"
          }`}
        >
          {feedback.type === "success" ? (
            <FiCheck className="h-4 w-4" />
          ) : (
            <FiAlertCircle className="h-4 w-4" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* VIEW 1: PENDING AUDIT CARDS */}
      {activeTab === "pending" && (
        <>
          {pendingAudits.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-800 bg-neutral-900/20 text-center">
              <FiCheck className="mb-2 h-6 w-6 text-emerald-500" />
              <h3 className="text-sm font-semibold text-white">
                All proofs reviewed
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                No submitted scorecard links currently awaiting verification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingAudits.map((item) => (
                <div
                  key={item.id}
                  className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 shadow-2xl backdrop-blur-md transition-all hover:border-neutral-700"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                      <FiClock className="h-3.5 w-3.5" />
                      Pending Review
                    </span>
                    <span className="font-mono text-[11px] text-neutral-500">
                      ID: {item.id.slice(0, 8)}
                    </span>
                  </div>

                  <div className="space-y-3 py-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-neutral-400">
                        <FiUser className="h-4 w-4 text-neutral-500" /> User
                      </span>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {item.user.full_name}
                        </p>
                        <p className="font-mono text-[11px] text-neutral-500">
                          {item.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-neutral-400">
                        <FiAward className="h-4 w-4 text-neutral-500" /> Match
                        Tier
                      </span>
                      <span className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0.5 font-mono text-xs font-bold text-neutral-200">
                        {item.result.match_type} Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-800/50 pt-2">
                      <span className="text-neutral-400">Prize Amount</span>
                      <span className="font-mono text-base font-black tracking-tight text-emerald-400">
                        {formatCurrencyINR(item.result.prize_amount)}
                      </span>
                    </div>
                  </div>

                  {item.proof_url && (
                    <div className="pt-1">
                      <a
                        href={item.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-700/80 bg-neutral-800/70 py-2.5 text-xs font-semibold text-neutral-200 transition hover:border-neutral-600 hover:bg-neutral-800 hover:text-white"
                      >
                        <span>Open Proof</span>
                        <FiExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                      </a>
                    </div>
                  )}

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-neutral-800/80 pt-4">
                    <button
                      type="button"
                      disabled={
                        reviewMutation.isPending &&
                        activeProcessingId === item.id
                      }
                      onClick={() => handleApprove(item.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20 hover:border-emerald-500/40 active:scale-[0.98] disabled:opacity-40"
                    >
                      <FiCheck className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      type="button"
                      disabled={
                        reviewMutation.isPending &&
                        activeProcessingId === item.id
                      }
                      onClick={() => handleReject(item.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2.5 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20 hover:border-rose-500/40 active:scale-[0.98] disabled:opacity-40"
                    >
                      <FiX className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: UNCLAIMED / REMAINING WINNERS TABLE */}
      {activeTab === "unclaimed" && (
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/40 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  <th className="py-3.5 pl-5 pr-3">Winner</th>
                  <th className="px-3 py-3.5">Email</th>
                  <th className="px-3 py-3.5">Match Tier</th>
                  <th className="px-3 py-3.5">Prize</th>
                  <th className="px-3 py-3.5">Draw Period</th>
                  <th className="py-3.5 pl-3 pr-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {unclaimedWinners.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-neutral-500 text-xs"
                    >
                      All winners have submitted their claim proofs.
                    </td>
                  </tr>
                ) : (
                  unclaimedWinners.map((winner) => (
                    <tr
                      key={winner.id}
                      className="transition hover:bg-neutral-800/30"
                    >
                      <td className="py-3.5 pl-5 pr-3 font-semibold text-white">
                        {winner.user.full_name}
                      </td>
                      <td className="px-3 py-3.5 font-mono text-xs text-neutral-400">
                        {winner.user.email}
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="inline-flex rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0.5 font-mono text-xs font-bold text-neutral-300">
                          {winner.result.match_type} Match
                        </span>
                      </td>
                      <td className="px-3 py-3.5 font-mono font-bold text-emerald-400">
                        {formatCurrencyINR(winner.result.prize_amount)}
                      </td>
                      <td className="px-3 py-3.5 font-mono text-xs text-neutral-400">
                        {winner.draw.month}/{winner.draw.year}
                      </td>
                      <td className="py-3.5 pl-3 pr-5 text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                          <FiMail className="h-3 w-3" /> Awaiting Submission
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
