import React from "react";

export interface PrizeTier {
  matchCount: number;
  amount: string;
}

interface PrizePoolSectionProps {
  monthName: string;
  tiers: PrizeTier[];
}

export const PrizePoolSection: React.FC<PrizePoolSectionProps> = ({
  monthName,
  tiers,
}) => {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/40 p-5">
      <h3 className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-neutral-400">
        {monthName} Prize Pool
      </h3>
      <div className="grid grid-cols-3 gap-2 divide-x divide-neutral-200 text-center">
        {tiers.map((tier) => (
          <div key={tier.matchCount} className="px-2">
            <span className="block text-xs font-semibold uppercase text-neutral-500">
              {tier.matchCount} Match
            </span>
            <span className="mt-1 block text-base font-bold tracking-tight text-neutral-950 sm:text-lg">
              {tier.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
