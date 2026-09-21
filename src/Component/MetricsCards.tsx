import React from "react";

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MetricCardsProps {
  metrics: MetricItem[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.id}
            className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm transition hover:border-neutral-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {metric.label}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {metric.value}
              </span>
              {metric.change && (
                <span className="mt-1 block text-xs text-emerald-400">
                  {metric.change}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
