import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

interface DrawStatusCardProps {
  drawName: string;
  status: "Open" | "Closed" | "Evaluating";
  participants: number;
  prizePool: string;
}

export const DrawStatusCard: React.FC<DrawStatusCardProps> = ({
  drawName,
  status,
  participants,
  prizePool,
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate("/admin/draws");
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Draw Status
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">{drawName}</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <span className="text-xs text-neutral-400">
            Registered Participants
          </span>
          <p className="mt-1 text-xl font-bold tracking-tight text-white">
            {participants.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <span className="text-xs text-neutral-400">Active Pool</span>
          <p className="mt-1 text-xl font-bold tracking-tight text-white">
            {prizePool}
          </p>
        </div>
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={handleAction}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 active:scale-[0.99] sm:w-auto sm:px-6"
        >
          <span>Manage Draw</span>
          <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
