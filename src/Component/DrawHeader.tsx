import React from "react";

interface DrawHeaderProps {
  monthName: string;
}

export const DrawHeader: React.FC<DrawHeaderProps> = ({ monthName }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-950 uppercase">
          {monthName} Draw
        </h2>
        <p className="text-sm text-neutral-500">Your monthly participation</p>
      </div>
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-semibold text-neutral-800"></div>
    </div>
  );
};
