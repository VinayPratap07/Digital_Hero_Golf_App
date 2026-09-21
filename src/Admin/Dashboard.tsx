import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiUsers, FiUserCheck, FiAward, FiHeart } from "react-icons/fi";
import { MetricCards, type MetricItem } from "../Component/MetricsCards";
import {
  RecentWinnersTable,
  type WinnerRow,
} from "../Component/RecentWinnersTable";
import { DashboardHeader } from "../Component/DashboardHeader";
import { DrawStatusCard } from "../Component/DrawStatusCards";
import { getAdminDashboard } from "../AdminServices/AdminDashboard";

// 1. API Contract Definition
export interface ApiRecentWinner {
  id: string;
  drawId: string;
  userId: string;
  userName: string;
  match: string;
  matchType: number;
  prize: number;
  status: "Paid" | "Pending" | string;
  payoutStatus: string;
  verificationStatus: string;
  createdAt: string;
}

export interface ApiCurrentDraw {
  id: string;
  name: string;
  month: number;
  year: number;
  status: string;
  displayStatus: "Open" | "Closed" | "Evaluating" | string;
  drawType: string;
  drawNumbers: number[];
  activePool: number;
  registeredParticipants: number;
  publishedAt: string | null;
}

export interface AdminDashboardApiResponse {
  success: boolean;
  users: {
    total: number;
    activeSubscribers: number;
    inactiveSubscribers: number;
  };
  financial: {
    activePool: number;
    totalCharityContributions: number;
  };
  currentDraw: ApiCurrentDraw | null;
  recentWinners: ApiRecentWinner[];
}

// Helper: Format raw numeric values into INR currency display
function formatCurrencyINR(amount: number = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminDashboard() {
  const {
    data: dashboard,
    isLoading,
    isError,
  } = useQuery<AdminDashboardApiResponse>({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
    refetchOnWindowFocus: false,
  });

  // 2. Map Users & Financial Data to MetricCards
  const metrics: MetricItem[] = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        id: "total-users",
        label: "Total Users",
        value: dashboard.users?.total?.toLocaleString() ?? "0",
        icon: FiUsers,
      },
      {
        id: "active-subscribers",
        label: "Active Subscribers",
        value: dashboard.users?.activeSubscribers?.toLocaleString() ?? "0",
        icon: FiUserCheck,
      },
      {
        id: "prize-pool",
        label: "Prize Pool",
        value: formatCurrencyINR(dashboard.financial?.activePool ?? 0),
        icon: FiAward,
      },
      {
        id: "charity-contributions",
        label: "Charity Contributions",
        value: formatCurrencyINR(
          dashboard.financial?.totalCharityContributions ?? 0,
        ),
        icon: FiHeart,
      },
    ];
  }, [dashboard]);

  // 3. Map Recent Winners to Table Row Contract
  const winners: WinnerRow[] = useMemo(() => {
    if (!dashboard?.recentWinners) return [];

    return dashboard.recentWinners.map((winner) => ({
      id: winner.id,
      userName: winner.userName || "Anonymous",
      matchTier: winner.match || `${winner.matchType} Match`,
      prizeAmount: formatCurrencyINR(winner.prize),
      status: winner.status === "Paid" ? "Paid" : "Pending",
    }));
  }, [dashboard]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-sm text-neutral-400">
        Loading dashboard metrics...
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-sm text-red-400">
        Failed to load dashboard data. Check your API endpoint.
      </div>
    );
  }

  const currentDraw = dashboard.currentDraw;
  const drawStatus =
    currentDraw?.displayStatus === "Closed" ||
    currentDraw?.displayStatus === "Evaluating"
      ? currentDraw.displayStatus
      : "Open";

  const periodLabel = currentDraw
    ? `${new Date(currentDraw.year, currentDraw.month - 1).toLocaleString(
        "default",
        {
          month: "long",
        },
      )} ${currentDraw.year}`
    : "Active Period";

  return (
    <div className="min-h-screen space-y-8 bg-neutral-950 p-6 md:p-10">
      <DashboardHeader
        title="Dashboard"
        subtitle="Overview of Digital Heroes"
        period={periodLabel}
      />

      <MetricCards metrics={metrics} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {currentDraw ? (
          <DrawStatusCard
            drawName={currentDraw.name}
            status={drawStatus}
            participants={currentDraw.registeredParticipants}
            prizePool={formatCurrencyINR(currentDraw.activePool)}
          />
        ) : (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 text-sm text-neutral-400">
            No active draw record available.
          </div>
        )}

        <RecentWinnersTable winners={winners} />
      </div>
    </div>
  );
}
