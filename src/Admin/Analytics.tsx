import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiUsers, FiUserCheck, FiUserX, FiShield } from "react-icons/fi";
import { getAdminAnalytics } from "../AdminServices/AdminAnalytics";

interface AdminAnalyticsResponse {
  activeSubscriberRate: number;
  activeSubscribers: number;
  admins: number;
  inactiveSubscribers: number;
  subscriberPercentage: number;
  total: number;
  totalProfiles: number;
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"6M" | "1Y">("6M");

  const { data, isLoading, isError } = useQuery<AdminAnalyticsResponse>({
    queryKey: ["admin-analytics"],
    queryFn: getAdminAnalytics,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
        Loading analytics...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-red-400">
        Failed to load analytics. Please check network connectivity or
        permissions.
      </div>
    );
  }

  // Normalized derivations (prevents division by zero and faulty >100% rates)
  const totalUsers = data.totalProfiles ?? data.total ?? 0;
  const activeSubs = data.activeSubscribers ?? 0;
  const inactiveSubs = data.inactiveSubscribers ?? 0;
  const adminCount = data.admins ?? 0;

  const activePercent =
    totalUsers > 0
      ? Math.min(100, Math.round((activeSubs / totalUsers) * 100))
      : 0;
  const inactivePercent =
    totalUsers > 0
      ? Math.min(
          100 - activePercent,
          Math.round((inactiveSubs / totalUsers) * 100),
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-neutral-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Analytics
          </h1>
          <p className="text-sm text-neutral-400">
            Performance overview across user acquisition, prize distributions,
            and charity impacts.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900/60 p-1 backdrop-blur-sm">
          {(["6M", "1Y"] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                timeRange === range
                  ? "bg-white text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: DYNAMIC USER METRICS */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          User Subscriptions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Accounts */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase">
                Total Profiles
              </span>
              <FiUsers className="h-4 w-4 text-neutral-300" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-white">
                {totalUsers.toLocaleString()}
              </span>
              <span className="mt-1 block text-xs text-neutral-500">
                Total registered user records
              </span>
            </div>
          </div>

          {/* Active Subscribers */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-semibold uppercase">
                Active Subscribers
              </span>
              <FiUserCheck className="h-4 w-4" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-white">
                {activeSubs.toLocaleString()}
              </span>
              <span className="mt-1 block text-xs text-emerald-400/80">
                {activePercent}% of total accounts
              </span>
            </div>
          </div>

          {/* Inactive Subscribers */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-semibold uppercase">Inactive</span>
              <FiUserX className="h-4 w-4 text-neutral-500" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-neutral-300">
                {inactiveSubs.toLocaleString()}
              </span>
              <span className="mt-1 block text-xs text-neutral-500">
                {inactivePercent}% lapsed or unverified
              </span>
            </div>
          </div>

          {/* Administrators */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sky-400">
              <span className="text-xs font-semibold uppercase">Admins</span>
              <FiShield className="h-4 w-4" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-white">
                {adminCount.toLocaleString()}
              </span>
              <span className="mt-1 block text-xs text-neutral-500">
                Platform control roles
              </span>
            </div>
          </div>
        </div>

        {/* Proportional Ratio Bar */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Subscriber Ratio</span>
            <span>
              {activeSubs} Active ({activePercent}%) vs {inactiveSubs} Inactive
              ({inactivePercent}%)
            </span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-neutral-800">
            <div
              style={{ width: `${activePercent}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Active: ${activePercent}%`}
            />
            <div
              style={{ width: `${inactivePercent}%` }}
              className="bg-neutral-600 transition-all duration-500"
              title={`Inactive: ${inactivePercent}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
