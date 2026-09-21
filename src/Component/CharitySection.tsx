import React from "react";

interface CharitySectionProps {
  charity: {
    name: string;
    imageUrl?: string;
    contributionPercentage: number;
  };
  onViewCharity?: () => void;
  onChangeCharity?: () => void;
}

export const CharitySection: React.FC<CharitySectionProps> = ({
  charity,
  onViewCharity,
  onChangeCharity,
}) => {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
        Your Charity
      </h3>
      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200">
            {charity.imageUrl ? (
              <img
                src={charity.imageUrl}
                alt={charity.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                Logo
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-950">
              {charity.name}
            </h4>
            <p className="text-xs text-neutral-500">
              You're contributing {charity.contributionPercentage}% of your
              subscription
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onViewCharity}
            className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-100"
          >
            View Charity
          </button>
          <button
            type="button"
            onClick={onChangeCharity}
            className="rounded-full bg-black px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
          >
            Change Charity
          </button>
        </div>
      </div>
    </div>
  );
};
