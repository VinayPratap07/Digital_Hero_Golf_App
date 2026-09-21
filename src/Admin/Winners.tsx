import { useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiExternalLink,
  FiX,
  FiCreditCard,
  FiShield,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";

export type VerificationState = "Pending" | "Verified" | "Rejected";
export type PaymentState = "Unpaid" | "Paid";

export interface WinnerRecord {
  id: string;
  user: string;
  draw: string;
  match: string;
  prize: string;
  scoreProofUrl: string;
  verificationStatus: VerificationState;
  paymentStatus: PaymentState;
  submittedAt: string;
}

const INITIAL_WINNERS: WinnerRecord[] = [
  {
    id: "win_1",
    user: "Rahul",
    draw: "Sep 2026",
    match: "5 Match",
    prize: "₹50,000",
    scoreProofUrl:
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80",
    verificationStatus: "Pending",
    paymentStatus: "Unpaid",
    submittedAt: "2026-09-18 14:32",
  },
  {
    id: "win_2",
    user: "Aman",
    draw: "Sep 2026",
    match: "4 Match",
    prize: "₹12,000",
    scoreProofUrl:
      "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80",
    verificationStatus: "Verified",
    paymentStatus: "Unpaid",
    submittedAt: "2026-09-15 09:12",
  },
  {
    id: "win_3",
    user: "Priya",
    draw: "Aug 2026",
    match: "3 Match",
    prize: "₹5,000",
    scoreProofUrl:
      "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=800&q=80",
    verificationStatus: "Verified",
    paymentStatus: "Paid",
    submittedAt: "2026-08-30 18:40",
  },
];

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<WinnerRecord[]>(INITIAL_WINNERS);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedWinner = winners.find((w) => w.id === selectedWinnerId) || null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateStatus = (
    verificationStatus: VerificationState,
    paymentStatus?: PaymentState,
  ) => {
    if (!selectedWinnerId) return;

    setWinners((prev) =>
      prev.map((w) => {
        if (w.id !== selectedWinnerId) return w;
        return {
          ...w,
          verificationStatus,
          paymentStatus:
            paymentStatus !== undefined ? paymentStatus : w.paymentStatus,
        };
      }),
    );
  };

  const handleApprove = () => {
    updateStatus("Verified");
    triggerToast("Winner proof verified and approved.");
  };

  const handleReject = () => {
    updateStatus("Rejected", "Unpaid");
    triggerToast("Winner proof submission rejected.");
  };

  const handleMarkAsPaid = () => {
    updateStatus("Verified", "Paid");
    triggerToast("Payout marked as completed.");
  };

  // Status badge helper
  const renderStatusBadge = (winner: WinnerRecord) => {
    if (winner.paymentStatus === "Paid") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
          <FiCheckCircle className="h-3 w-3" /> Paid
        </span>
      );
    }

    if (winner.verificationStatus === "Verified") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
          <FiCheckCircle className="h-3 w-3" /> Verified
        </span>
      );
    }

    if (winner.verificationStatus === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
          <FiXCircle className="h-3 w-3" /> Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
        <FiClock className="h-3 w-3" /> Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-neutral-900/95 px-4 py-3 text-sm font-semibold text-emerald-400 shadow-2xl backdrop-blur-md animate-in fade-in">
          <FiCheck className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Winners
        </h1>
        <p className="text-sm text-neutral-400">
          Review score proofs, verify eligibility, and disburse prize payouts.
        </p>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/40 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <th scope="col" className="py-3.5 pl-5 pr-3">
                  User
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Draw
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Match
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Prize
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Status
                </th>
                <th scope="col" className="py-3.5 pl-3 pr-5 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {winners.map((winner) => (
                <tr
                  key={winner.id}
                  onClick={() => setSelectedWinnerId(winner.id)}
                  className="cursor-pointer transition hover:bg-neutral-800/30"
                >
                  <td className="py-3.5 pl-5 pr-3 font-semibold text-white">
                    {winner.user}
                  </td>
                  <td className="px-3 py-3.5 text-neutral-400">
                    {winner.draw}
                  </td>
                  <td className="px-3 py-3.5 font-medium text-neutral-200">
                    {winner.match}
                  </td>
                  <td className="px-3 py-3.5 font-semibold text-white">
                    {winner.prize}
                  </td>
                  <td className="px-3 py-3.5">{renderStatusBadge(winner)}</td>
                  <td className="py-3.5 pl-3 pr-5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWinnerId(winner.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-neutral-600 hover:bg-neutral-700 active:scale-95"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification & Payout Slide-over Drawer */}
      {selectedWinner && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="flex h-full w-full max-w-md flex-col justify-between border-l border-neutral-800 bg-neutral-950 p-6 shadow-2xl overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Winner Details
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Claim ID: {selectedWinner.id} • {selectedWinner.submittedAt}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedWinnerId(null)}
                  className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Winner Info Summary */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
                <div>
                  <span className="block text-xs font-semibold uppercase text-neutral-500">
                    User
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-white">
                    {selectedWinner.user}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase text-neutral-500">
                    Draw
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-white">
                    {selectedWinner.draw}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase text-neutral-500">
                    Match
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-white">
                    {selectedWinner.match}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase text-neutral-500">
                    Prize
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-white">
                    {selectedWinner.prize}
                  </span>
                </div>
              </div>

              {/* Score Proof Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Score Proof
                  </span>
                  <a
                    href={selectedWinner.scoreProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition"
                  >
                    <span>Full Resolution</span>
                    <FiExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                  <img
                    src={selectedWinner.scoreProofUrl}
                    alt="Uploaded scorecard proof"
                    className="h-44 w-full object-cover transition duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <a
                      href={selectedWinner.scoreProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-950 shadow-md"
                    >
                      View Screenshot
                    </a>
                  </div>
                </div>
              </div>

              {/* Stage 1: Verification Review */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    <FiShield className="h-3.5 w-3.5" /> Verification
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      selectedWinner.verificationStatus === "Verified"
                        ? "text-emerald-400"
                        : selectedWinner.verificationStatus === "Rejected"
                          ? "text-rose-400"
                          : "text-amber-400"
                    }`}
                  >
                    ● {selectedWinner.verificationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={selectedWinner.verificationStatus === "Verified"}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiCheck className="h-3.5 w-3.5" /> Approve
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={selectedWinner.verificationStatus === "Rejected"}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiX className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>

              {/* Stage 2: Payment Execution */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
                    <FiCreditCard className="h-3.5 w-3.5" /> Payment
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      selectedWinner.paymentStatus === "Paid"
                        ? "text-sky-400"
                        : "text-amber-400"
                    }`}
                  >
                    ●{" "}
                    {selectedWinner.paymentStatus === "Paid"
                      ? "Paid"
                      : "Pending"}
                  </span>
                </div>

                {selectedWinner.verificationStatus !== "Verified" ? (
                  <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/60 p-2.5 text-xs text-neutral-400">
                    <FiAlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>Approve score proof before disbursing payout.</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkAsPaid}
                    disabled={selectedWinner.paymentStatus === "Paid"}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-xs font-bold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiCreditCard className="h-3.5 w-3.5" />
                    {selectedWinner.paymentStatus === "Paid"
                      ? "Disbursement Completed"
                      : "Mark as Paid"}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Dismiss */}
            <div className="border-t border-neutral-800 pt-4">
              <button
                type="button"
                onClick={() => setSelectedWinnerId(null)}
                className="w-full rounded-full border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-800"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
