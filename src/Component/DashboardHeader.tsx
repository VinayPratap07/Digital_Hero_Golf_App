import React from "react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  period?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Dashboard",
  subtitle = "Overview of Digital Heroes",
  period = "September 2026",
}) => {
  return (
    <div className="flex flex-col gap-2 border-b border-neutral-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <p className="text-sm text-neutral-400">{subtitle}</p>
      </div>
      <div className="inline-flex w-fit items-center rounded-full border border-neutral-800 bg-neutral-900/60 px-3.5 py-1 text-xs font-medium text-neutral-300 backdrop-blur-sm">
        {period}
      </div>
    </div>
  );
};
