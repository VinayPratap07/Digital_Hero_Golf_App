import React from "react";
import { FaArrowRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export interface Charity {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

interface CharityCardProps {
  charity: Charity;
  featured?: boolean;
  onSelect?: (id: string) => void;
}

export const CharityCard: React.FC<CharityCardProps> = ({
  charity,
  onSelect,
}) => {
  const { id, name, description, image_url, is_active } = charity;

  return (
    <div className="relative flex flex-col justify-between rounded-3xl bg-white p-7 transition-all duration-200 border border-neutral-200/80 shadow-sm hover:shadow-md ">
      <div>
        {/* Header: Image & Status */}
        <div className="relative mb-5 h-44 w-full overflow-hidden rounded-2xl bg-neutral-100">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-400">
              No preview available
            </div>
          )}

          {/* Active / Inactive Pill */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-md ${
                is_active
                  ? "bg-emerald-50/90 text-emerald-700 border border-emerald-200"
                  : "bg-neutral-100/90 text-neutral-500 border border-neutral-200"
              }`}
            >
              {is_active ? (
                <>
                  <FaCheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  Active
                </>
              ) : (
                <>
                  <FaTimesCircle className="h-3.5 w-3.5 text-neutral-400" />
                  Inactive
                </>
              )}
            </span>
          </div>
        </div>

        {/* Charity Details */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-neutral-950">
            {name}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600">
            {description || "No description provided for this organization."}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 border-t border-neutral-100 pt-5">
        <button
          type="button"
          onClick={() => onSelect?.(id)}
          className="group flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all duration-150 bg-neutral-100 text-neutral-400 bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
        >
          <span>Support Cause</span>
          <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
