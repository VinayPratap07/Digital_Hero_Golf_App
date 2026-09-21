import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiEdit2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiLoader,
} from "react-icons/fi";
import {
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  type ApiUserItem,
} from "../AdminServices/AdminUserAPI";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  subscriptionStatus: "Active" | "Inactive";
  planName: string;
  scoresCount: number;
  totalWinnings: number;
}

function mapApiUserToUI(item: ApiUserItem): UserRow {
  const isStatusActive = item.subscription?.status?.toLowerCase() === "active";
  console.log(item.profile.id);
  return {
    id: item.profile.id,
    name: item.profile.name || item.profile.name || "Unnamed User",
    email: item.email || "No email",
    role: item.profile.role ?? "user",
    subscriptionStatus: isStatusActive ? "Active" : "Inactive",
    planName: item.subscription?.plan
      ? item.subscription.plan.charAt(0).toUpperCase() +
        item.subscription.plan.slice(1)
      : "Free",
    scoresCount: item.statistics?.golf_scores_count ?? item.scores?.length ?? 0,
    totalWinnings: item.statistics?.total_winnings ?? 0,
  };
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  // Form State for editing
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    role: "user" | "admin";
  }>({ name: "", email: "", role: "user" });

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<ApiUserItem[], Error, UserRow[]>({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
    select: (data) => data.map(mapApiUserToUI),
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedUser(null);
    },
    onError: (err) => {
      alert(`Update failed: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      if (selectedUser) setSelectedUser(null);
    },
    onError: (err) => {
      alert(`Deletion failed: ${err.message}`);
    },
  });

  const handleOpenDrawer = (user: UserRow) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    updateMutation.mutate({
      user_id: selectedUser.id,
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (
      confirm("Are you sure you want to permanently delete this user account?")
    ) {
      deleteMutation.mutate(userId);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || user.subscriptionStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-sm text-neutral-400">
        <FiLoader className="h-4 w-4 animate-spin" /> Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-red-400">
        Failed to load users. Verify network connection and admin credentials.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">Users</h1>
        <p className="text-sm text-neutral-400">
          Inspect directory data, update role/account details, or revoke system
          access.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-neutral-800 bg-neutral-900/60 py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 backdrop-blur-sm transition focus:border-neutral-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start rounded-full border border-neutral-800 bg-neutral-900/60 p-1 backdrop-blur-sm sm:self-auto">
          <span className="flex items-center gap-1 pl-2.5 pr-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <FiFilter className="h-3 w-3" /> Filter:
          </span>
          {(["All", "Active", "Inactive"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                statusFilter === filter
                  ? "bg-white text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 shadow-sm backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/40 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <th scope="col" className="py-3.5 pl-5 pr-3">
                  User
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Role
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Subscription
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Scores Logged
                </th>
                <th scope="col" className="py-3.5 pl-3 pr-5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-neutral-800/30"
                  >
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="font-semibold text-white">
                        {user.name}
                      </div>
                      <div className="font-mono text-xs text-neutral-400">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-xs uppercase text-neutral-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          user.subscriptionStatus === "Active"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-neutral-700 bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {user.subscriptionStatus === "Active" ? (
                          <FiCheckCircle className="h-3 w-3" />
                        ) : (
                          <FiAlertCircle className="h-3 w-3" />
                        )}
                        {user.subscriptionStatus} ({user.planName})
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-lg bg-neutral-800 px-2 text-xs font-bold text-neutral-200">
                        {user.scoresCount}
                      </span>
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(user)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-700 active:scale-95"
                        >
                          <FiEdit2 className="h-3 w-3" /> Edit
                        </button>
                        <button
                          type="button"
                          disabled={deleteMutation.isPending}
                          onClick={() => handleDeleteUser(user.id)}
                          className="inline-flex items-center rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-xs text-red-400 transition hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveUpdate}
            className="flex h-full w-full max-w-md flex-col justify-between border-l border-neutral-800 bg-neutral-950 p-6 shadow-2xl"
          >
            <div className="space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Edit Profile</h2>
                  <p className="font-mono text-xs text-neutral-500">
                    ID: {selectedUser.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-neutral-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-neutral-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        role: e.target.value as "user" | "admin",
                      }))
                    }
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-neutral-700 focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Read-Only Status Indicators */}
                <div className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 text-xs">
                  <div className="text-neutral-500 font-semibold uppercase tracking-wider">
                    Edge Metadata
                  </div>
                  <div className="flex justify-between py-1 text-neutral-400">
                    <span>Plan Tier</span>
                    <span className="font-semibold text-white">
                      {selectedUser.planName}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-neutral-400">
                    <span>Recorded Winnings</span>
                    <span className="font-semibold text-emerald-400">
                      ${selectedUser.totalWinnings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-4">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex w-full items-center justify-center rounded-full bg-white py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
