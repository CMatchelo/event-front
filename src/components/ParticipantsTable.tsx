"use client";

import { useState } from "react";
import { Participant } from "../types/Participant";
import { AppEvent } from "../types/Event";
import { ParticipantRow } from "./ParticipantRow";

interface ParticipantsTableProps {
  participants: Participant[];
  event: AppEvent;
}

export default function ParticipantsTable({
  participants,
  event,
}: ParticipantsTableProps) {
  const [filter, setFilter] = useState<"all" | "inside" | "outside">("all");
  const [search, setSearch] = useState("");

  const filtered = participants.filter((p) => {
    const matchStatus = filter === "all" || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 shadow-lg overflow-hidden">
      {/* Table header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Participants</h2>
          <p className="text-xs text-slate-500">
            {participants.length} registered
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name..."
              className="rounded-lg border border-white/8 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
            />
          </div>

          {/* Status filter */}
          <div className="flex rounded-lg border border-white/8 bg-white/5 p-0.5">
            {(["all", "inside", "outside"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Type
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                Check-ins
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  {search || filter !== "all"
                    ? "No participants match your filters"
                    : "No participants registered"}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <ParticipantRow key={p.id} participant={p} event={event} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      {participants.length > 0 && (
        <div className="flex items-center justify-between border-t border-white/5 px-5 py-3 text-xs text-slate-500">
          <span>
            {participants.filter((p) => p.status === "inside").length} inside ·{" "}
            {participants.filter((p) => p.status === "outside").length} outside
          </span>
          <span>
            {participants.filter((p) => p.type === "vip").length} VIP ·{" "}
            {participants.filter((p) => p.type === "normal").length} Normal
          </span>
        </div>
      )}
    </div>
  );
}
