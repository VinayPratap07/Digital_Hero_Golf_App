import React from "react";

export interface WinnerRow {
  id: string;
  userName: string;
  matchTier: string;
  prizeAmount: string;
  status: "Paid" | "Pending" | "Failed";
}

interface RecentWinnersTableProps {
  winners: WinnerRow[];
}

export const RecentWinnersTable: React.FC<RecentWinnersTableProps> = ({
  winners,
}) => {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Recent Winners
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500">
              <th scope="col" className="pb-3 pl-2">
                User
              </th>
              <th scope="col" className="pb-3">
                Match
              </th>
              <th scope="col" className="pb-3">
                Prize
              </th>
              <th scope="col" className="pb-3 pr-2 text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {winners.map((winner) => (
              <tr
                key={winner.id}
                className="transition hover:bg-neutral-800/30"
              >
                <td className="py-3 pl-2 font-medium text-white">
                  {winner.userName}
                </td>
                <td className="py-3 text-neutral-400">{winner.matchTier}</td>
                <td className="py-3 font-semibold text-white">
                  {winner.prizeAmount}
                </td>
                <td className="py-3 pr-2 text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      winner.status === "Paid"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {winner.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
