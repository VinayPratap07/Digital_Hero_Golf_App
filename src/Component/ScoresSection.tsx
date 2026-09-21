import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import {
  uploadScore,
  updateScore,
  deleteScore,
} from "../Services/Score.service";

export interface ScoreEntry {
  id: string;
  score_date: string;
  score: number;
}

interface ScoresSectionProps {
  scores: ScoreEntry[];
  isEntered: boolean;
}

export default function ScoresSection({
  scores,
  isEntered,
}: ScoresSectionProps) {
  const queryClient = useQueryClient();

  // Add Score Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addScore, setAddScore] = useState("");
  const [addDate, setAddDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  // Inline Edit Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState("");
  const [editDate, setEditDate] = useState("");

  // Error/Toast State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const invalidateScores = () => {
    queryClient.invalidateQueries({ queryKey: ["golf-scores"] });
  };

  // --- Mutations ---
  const uploadMutation = useMutation({
    mutationFn: ({ score, date }: { score: number; date: string }) =>
      uploadScore(score, date),
    onSuccess: () => {
      setAddScore("");
      setIsAddOpen(false);
      setErrorMessage(null);
      invalidateScores();
    },
    onError: (err: unknown) => {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to add score",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      scoreId,
      score,
      date,
    }: {
      scoreId: string;
      score: number;
      date: string;
    }) => updateScore({ scoreId, score, date }),
    onSuccess: () => {
      setEditingId(null);
      setErrorMessage(null);
      invalidateScores();
    },
    onError: (err: unknown) => {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to update score",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (scoreId: string) => deleteScore(scoreId),
    onSuccess: () => {
      setErrorMessage(null);
      invalidateScores();
    },
    onError: (err: unknown) => {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to delete score",
      );
    },
  });

  // --- Handlers ---
  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = Number(addScore);
    if (isNaN(parsed) || parsed < 1 || parsed > 45 || !addDate) return;

    uploadMutation.mutate({ score: parsed, date: addDate });
  };

  const handleStartEdit = (item: ScoreEntry) => {
    setEditingId(item.id);
    setEditScore(String(item.score));
    setEditDate(item.score_date);
  };

  const handleSaveEdit = (scoreId: string) => {
    const parsed = Number(editScore);
    if (isNaN(parsed) || parsed < 1 || parsed > 45 || !editDate) return;

    updateMutation.mutate({ scoreId, score: parsed, date: editDate });
  };

  const handleDelete = (scoreId: string) => {
    if (window.confirm("Are you sure you want to delete this score?")) {
      deleteMutation.mutate(scoreId);
    }
  };

  const isBusy =
    uploadMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Left Column: List & Add/Edit Actions */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Your Scores ({scores.length}/5)
          </h3>
          {errorMessage && (
            <span className="text-[11px] font-semibold text-rose-500">
              {errorMessage}
            </span>
          )}
        </div>

        <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-2">
          {scores.map((item) => {
            const isEditing = editingId === item.id;

            if (isEditing) {
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 px-2 py-2 text-xs"
                >
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-800 outline-none focus:border-neutral-900"
                  />
                  <input
                    type="number"
                    min={1}
                    max={45}
                    required
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                    className="w-16 rounded-lg border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-800 outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleSaveEdit(item.id)}
                    aria-label="Save"
                    className="rounded p-1.5 text-emerald-600 transition hover:bg-emerald-50"
                  >
                    <FaCheck />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel"
                    className="rounded p-1.5 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100/50"
              >
                <span className="text-xs text-neutral-500">
                  {item.score_date}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-neutral-950">
                    {item.score}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleStartEdit(item)}
                      aria-label="Edit score"
                      className="rounded p-1 text-neutral-400 hover:text-neutral-900"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete score"
                      className="rounded p-1 text-neutral-400 hover:text-rose-600"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {scores.length === 0 && (
            <p className="px-3 py-2 text-xs text-neutral-400">
              No scores recorded yet.
            </p>
          )}
        </div>

        {/* Add Score Form */}
        {isAddOpen ? (
          <form
            onSubmit={handleAddSubmit}
            className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-sm"
          >
            <input
              type="date"
              required
              value={addDate}
              onChange={(e) => setAddDate(e.target.value)}
              className="rounded-lg border border-neutral-200 px-2.5 py-1 text-xs text-neutral-800 outline-none focus:border-neutral-900"
            />
            <input
              type="number"
              required
              min={1}
              max={45}
              placeholder="1–45"
              value={addScore}
              onChange={(e) => setAddScore(e.target.value)}
              className="w-20 rounded-lg border border-neutral-200 px-2.5 py-1 text-xs text-neutral-800 outline-none focus:border-neutral-900"
            />
            <button
              type="submit"
              disabled={isBusy}
              className="rounded-lg bg-neutral-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-black disabled:opacity-50"
            >
              {uploadMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="text-xs text-neutral-500 hover:text-neutral-800"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 transition hover:text-black"
          >
            <FaPlus className="text-[10px]" /> Add Score
          </button>
        )}
      </div>

      {/* Right Column: Draw Status */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
          Draw Status
        </h3>
        <div className="flex h-44 flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            {isEntered ? (
              <>
                <FaCheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Entered
                </span>
              </>
            ) : (
              <>
                <FaClock className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Pending ({scores.length}/5 scores)
                </span>
              </>
            )}
          </div>
          <div>
            <span className="text-xs text-neutral-400">Tracked numbers</span>
            <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-neutral-800">
              {scores.map((s) => s.score).join(" ") || "None"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
