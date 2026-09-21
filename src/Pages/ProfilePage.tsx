import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiMail,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiLogOut,
  FiTarget,
  FiAward,
  FiCalendar,
  FiHeart,
} from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../Lib/SupaBase";
import { getMyProfile } from "../Services/auth.service";
import { HiHome } from "react-icons/hi2";

// --- API Schema Types ---
export interface ApiUserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | string;
  created_at: string;
  updated_at: string;
}

export interface ApiUserSubscription {
  id: string;
  user_id: string;
  plan: string;
  status: "active" | "canceled" | "past_due" | "inactive" | string;
  current_period_start: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiGolfScore {
  id: string;
  user_id: string;
  score: number;
  score_date: string;
  created_at: string;
  updated_at: string;
}

export interface ApiCharity {
  id: string;
  name: string;
  description?: string | null;
}

export interface ApiProfileSummary {
  golf_scores_count: number;
  total_draws_entered: number;
  total_wins: number;
  total_winnings: number;
  total_paid_out: number;
  pending_payout: number;
  charity_contributions_count: number;
}

export interface MyProfileApiResponse {
  success: boolean;
  profile: ApiUserProfile;
  subscription: ApiUserSubscription | null;
  charity: ApiCharity | null;
  charity_selection: unknown | null;
  charity_contributions: unknown[];
  draw_history: unknown[];
  draw_results: unknown[];
  golf_scores: ApiGolfScore[];
  payouts: unknown[];
  winner_verifications: unknown[];
  summary: ApiProfileSummary;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrencyINR(amount: number = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: apiResponse,
  } = useQuery<MyProfileApiResponse>({
    queryKey: ["user-profile"],
    queryFn: getMyProfile,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const profile = apiResponse?.profile;
  const subscription = apiResponse?.subscription;
  const summary = apiResponse?.summary;
  const charity = apiResponse?.charity;
  const golfScores = apiResponse?.golf_scores ?? [];

  const isAdmin = profile?.role?.toLowerCase() === "admin";
  const isSubscriptionActive = subscription?.status?.toLowerCase() === "active";

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      queryClient.clear();
      navigate("/login");
    }
  };

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f3] px-4 py-12">
        <div className="w-full max-w-3xl space-y-6 rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-sm animate-pulse">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2.5">
              <div className="h-6 w-1/3 rounded bg-neutral-200" />
              <div className="h-4 w-1/2 rounded bg-neutral-200" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="h-16 rounded-2xl bg-neutral-100" />
            <div className="h-16 rounded-2xl bg-neutral-100" />
            <div className="h-16 rounded-2xl bg-neutral-100" />
          </div>
          <div className="space-y-3 pt-6 border-t border-neutral-100">
            <div className="h-12 w-full rounded-xl bg-neutral-100" />
            <div className="h-12 w-full rounded-xl bg-neutral-100" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f3] px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <FiAlertCircle size={24} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-neutral-900">
            Unable to load profile
          </h2>
          <p className="mb-6 text-sm text-neutral-600">
            {error instanceof Error
              ? error.message
              : "Failed to fetch account records."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full rounded-full bg-black py-3 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f3] py-8 px-4 text-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/80 bg-white text-neutral-800 shadow-sm transition hover:scale-105 hover:bg-neutral-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            aria-label="Return to Home"
          >
            <HiHome className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Top Profile Header Card */}
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 font-mono text-xl font-bold text-white">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : "GM"}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-start">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                  {profile.name || "Golf Member"}
                </h1>

                {isAdmin ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <FiShield size={12} className="text-neutral-300" />
                    ADMIN
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
                    MEMBER
                  </span>
                )}
              </div>

              <p className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 sm:justify-start">
                <FiMail size={14} />
                {profile.email}
              </p>

              <p className="text-xs text-neutral-400">
                Member since {formatDate(profile.created_at)}
              </p>
            </div>
          </div>

          {/* Metrics Overview */}
          {summary && (
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-neutral-100 pt-6">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-3 text-center">
                <span className="flex items-center justify-center gap-1 text-[11px] font-semibold uppercase text-neutral-400">
                  <FiTarget size={12} /> Scores
                </span>
                <p className="mt-1 text-lg font-bold text-neutral-900">
                  {summary.golf_scores_count}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-3 text-center">
                <span className="flex items-center justify-center gap-1 text-[11px] font-semibold uppercase text-neutral-400">
                  <FiCalendar size={12} /> Draws
                </span>
                <p className="mt-1 text-lg font-bold text-neutral-900">
                  {summary.total_draws_entered}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-3 text-center">
                <span className="flex items-center justify-center gap-1 text-[11px] font-semibold uppercase text-neutral-400">
                  <FiAward size={12} /> Won
                </span>
                <p className="mt-1 text-lg font-bold text-neutral-900">
                  {formatCurrencyINR(summary.total_winnings)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Account Details & Plan Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Main Account Info */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8 md:col-span-2">
            <h2 className="mb-4 text-base font-semibold tracking-tight text-neutral-900">
              Account Information
            </h2>

            <dl className="divide-y divide-neutral-100 text-sm">
              <div className="flex items-center justify-between py-3.5">
                <dt className="font-medium text-neutral-500">Full Name</dt>
                <dd className="font-semibold text-neutral-900">
                  {profile.name || "Not provided"}
                </dd>
              </div>

              <div className="flex items-center justify-between py-3.5">
                <dt className="font-medium text-neutral-500">Email Address</dt>
                <dd className="max-w-[200px] truncate font-semibold text-neutral-900 sm:max-w-xs">
                  {profile.email}
                </dd>
              </div>

              <div className="flex items-center justify-between py-3.5">
                <dt className="font-medium text-neutral-500">Role</dt>
                <dd className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                    {profile.role}
                  </span>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="group inline-flex items-center gap-1 rounded-md border border-neutral-200/60 bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-800 transition hover:border-black hover:bg-black hover:text-white"
                    >
                      <span>Panel</span>
                      <FiArrowUpRight size={14} />
                    </Link>
                  )}
                </dd>
              </div>

              <div className="flex items-center justify-between py-3.5">
                <dt className="font-medium text-neutral-500">
                  Supported Cause
                </dt>
                <dd className="flex items-center gap-1.5 font-semibold text-neutral-900">
                  <FiHeart size={14} className="text-rose-500" />
                  <span>{charity?.name || "None selected"}</span>
                </dd>
              </div>

              <div className="flex items-center justify-between py-3.5">
                <dt className="font-medium text-neutral-500">Joined On</dt>
                <dd className="text-xs font-medium text-neutral-900 sm:text-sm">
                  {formatDate(profile.created_at)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Membership Status Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-7">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Membership
                </span>
                {isSubscriptionActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <FiCheckCircle size={12} />
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
                    Free Tier
                  </span>
                )}
              </div>

              {subscription ? (
                <div className="mt-2 space-y-2">
                  <h3 className="text-xl font-bold capitalize tracking-tight text-neutral-900">
                    {subscription.plan} Plan
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-500">
                    Renewal date:{" "}
                    <span className="font-medium text-neutral-800">
                      {formatDate(subscription.current_period_end)}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                    No Active Plan
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-500">
                    Subscribe to participate in upcoming monthly prize draws.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-neutral-100 pt-6">
              <Link
                to="/pricing"
                className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-semibold transition ${
                  subscription
                    ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                    : "bg-black text-white shadow-sm hover:bg-neutral-800"
                }`}
              >
                <span>
                  {subscription ? "Manage Membership" : "Subscribe Now"}
                </span>
                {!subscription && <FiArrowRight size={13} />}
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Golf Scores Tracked */}
        {golfScores.length > 0 && (
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-base font-semibold tracking-tight text-neutral-900">
              Tracked Scores ({golfScores.length})
            </h2>

            <div className="divide-y divide-neutral-100">
              {golfScores.map((scoreItem) => (
                <div
                  key={scoreItem.id}
                  className="flex items-center justify-between py-3 text-sm font-medium"
                >
                  <span className="text-neutral-500">
                    {formatDate(scoreItem.score_date)}
                  </span>
                  <span className="font-mono text-base font-bold text-neutral-900">
                    {scoreItem.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
