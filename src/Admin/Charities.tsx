import React, { useState, useMemo } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiUploadCloud,
  FiCalendar,
  FiCheck,
  FiSearch,
  FiFilter,
  FiChevronDown,
} from "react-icons/fi";
import {
  createCharity,
  deleteCharity,
  getAdminCharities,
  updateCharity,
} from "../AdminServices/AdminCharityAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface CharityRecord {
  id: string;
  name: string;
  description: string;
  image_url: string;
  upcoming_event?: string;
  event_date?: string;
  is_active: boolean;
  created_at: string;
}

export type CharityFormData = Omit<CharityRecord, "id" | "created_at">;

export type SortOption = "newest" | "oldest" | "name_asc" | "name_desc";
export type StatusFilterOption = "All" | "Active" | "Inactive";

const EMPTY_CHARITY_FORM: CharityFormData = {
  name: "",
  description: "",
  image_url: "",
  upcoming_event: "",
  event_date: "",
  is_active: true,
};

export default function AdminCharitiesPage() {
  const queryClient = useQueryClient();

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Drawer & Form States
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CharityFormData>(EMPTY_CHARITY_FORM);
  const [notification, setNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch Remote Records
  const {
    data: charities = [],
    isLoading,
    isError,
  } = useQuery<CharityRecord[]>({
    queryKey: ["admin-charities"],
    queryFn: getAdminCharities,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCharity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-charities"] });
      triggerToast("Charity created successfully.");
      setIsDrawerOpen(false);
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to create charity.";
      triggerToast(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: string; data: CharityFormData }) =>
      updateCharity({
        id: variables.id,
        ...variables.data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-charities"] });
      triggerToast("Charity updated successfully.");
      setIsDrawerOpen(false);
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to update charity.";
      triggerToast(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCharity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-charities"] });
      triggerToast("Charity deleted successfully.");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to delete charity.";
      triggerToast(message);
    },
  });

  // Search, Status, & Sort Pipeline
  const filteredAndSortedCharities = useMemo(() => {
    return charities
      .filter((charity) => {
        const matchesSearch =
          charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (charity.description &&
            charity.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Active" ? charity.is_active : !charity.is_active);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime() || 0;
        const dateB = new Date(b.created_at).getTime() || 0;

        switch (sortBy) {
          case "newest":
            return dateB - dateA;
          case "oldest":
            return dateA - dateB;
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [charities, searchQuery, statusFilter, sortBy]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_CHARITY_FORM);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (charity: CharityRecord) => {
    setEditingId(charity.id);
    setFormData({
      name: charity.name || "",
      description: charity.description || "",
      image_url: charity.image_url || "",
      upcoming_event: charity.upcoming_event || "",
      event_date: charity.event_date || "",
      is_active: charity.is_active ?? true,
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
        Loading charities...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-red-400">
        Failed to fetch charity data. Check your connection or API server.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-neutral-900/95 px-4 py-3 text-sm font-semibold text-emerald-400 shadow-2xl backdrop-blur-md animate-in fade-in">
          <FiCheck className="h-4 w-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Charities
          </h1>
          <p className="text-sm text-neutral-400">
            Manage partner organizations, campaigns, and donation targets.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 active:scale-95"
        >
          <FiPlus className="h-4 w-4" />
          <span>Add Charity</span>
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search */}
        <div className="relative w-full lg:max-w-xs">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search charities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-neutral-800 bg-neutral-900/60 py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 backdrop-blur-sm transition focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
          />
        </div>

        {/* Right: Status Pills and Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 p-1 backdrop-blur-sm">
            <span className="flex items-center gap-1 pl-2.5 pr-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <FiFilter className="h-3 w-3" /> Status:
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

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none rounded-full border border-neutral-800 bg-neutral-900/60 py-1.5 pl-4 pr-9 text-xs font-semibold text-neutral-300 backdrop-blur-sm transition hover:border-neutral-700 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/40 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <th scope="col" className="w-20 py-3.5 pl-5 pr-3">
                  Image
                </th>
                <th scope="col" className="px-3 py-3.5">
                  Charity Name
                </th>
                <th scope="col" className="w-32 px-3 py-3.5">
                  Active
                </th>
                <th scope="col" className="w-36 py-3.5 pl-3 pr-5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredAndSortedCharities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-neutral-500">
                    No charities matching criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSortedCharities.map((charity) => (
                  <tr
                    key={charity.id}
                    className="transition hover:bg-neutral-800/30"
                  >
                    {/* Image Preview Cell */}
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/60">
                        {charity.image_url ? (
                          <img
                            src={charity.image_url}
                            alt={charity.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] uppercase text-neutral-500">
                            No Img
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Name & Event Cell */}
                    <td className="px-3 py-3.5">
                      <div className="font-semibold text-white">
                        {charity.name}
                      </div>
                      {charity.upcoming_event && (
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-400">
                          <FiCalendar className="h-3 w-3 text-neutral-500" />
                          <span>
                            {charity.upcoming_event}
                            {charity.event_date
                              ? ` (${charity.event_date})`
                              : ""}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Active Status Badge */}
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          charity.is_active
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-neutral-700 bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {charity.is_active ? (
                          <>
                            <FiCheckCircle className="h-3 w-3" /> Yes
                          </>
                        ) : (
                          <>
                            <FiAlertCircle className="h-3 w-3" /> No
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pl-3 pr-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(charity)}
                          aria-label={`Edit ${charity.name}`}
                          className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-300 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
                        >
                          <FiEdit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={deleteMutation.isPending}
                          onClick={() => handleDelete(charity.id, charity.name)}
                          aria-label={`Delete ${charity.name}`}
                          className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
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

      {/* Slide-over Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="flex h-full w-full max-w-lg flex-col justify-between overflow-y-auto border-l border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
            <form
              onSubmit={handleSave}
              className="flex h-full flex-col justify-between space-y-6"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {editingId ? "Edit Charity" : "Add Charity"}
                    </h2>
                    <p className="text-xs text-neutral-400">
                      {editingId
                        ? "Update partner information"
                        : "Create a new organization record"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Charity Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Save The Oceans Initiative"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-neutral-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain mission and goals..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-neutral-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Image URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        value={formData.image_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image_url: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-10 pr-3.5 text-sm text-white focus:border-neutral-700 focus:outline-none"
                      />
                      <FiUploadCloud className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    </div>
                    {formData.image_url && (
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="h-10 w-10 rounded-lg border border-neutral-800 object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <span className="text-xs text-neutral-500">
                          Preview
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Upcoming Event
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Charity Gala"
                        value={formData.upcoming_event}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            upcoming_event: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-neutral-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={formData.event_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            event_date: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-white focus:border-neutral-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
                    <div>
                      <span className="block text-sm font-semibold text-white">
                        Active Status
                      </span>
                      <span className="block text-xs text-neutral-500">
                        Visible in public charity choices and draws
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          is_active: !formData.is_active,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formData.is_active ? "bg-white" : "bg-neutral-800"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-neutral-950 shadow ring-0 transition duration-200 ease-in-out ${
                          formData.is_active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-1/3 rounded-full border border-neutral-800 bg-neutral-900 py-2.5 text-sm font-semibold text-neutral-300 transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 rounded-full bg-white py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Charity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
