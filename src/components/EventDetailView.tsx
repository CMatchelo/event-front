"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEventDetail, resetEventDetail } from "../store/eventDetailSlice";
import CheckinProportionChart from "./CheckinProportionChart";
import EntriesOverTimeChart from "./EntriesOverTimeChart";
import { formatDate } from "../utils/formatDate";
import { SkeletonDetailPage } from "./SkeletonDetailPage";
import { StatCard } from "./StatCard";
import ParticipantsTable from "./ParticipantsTable";
import { STATUS_CONFIG } from "../constants/status-config.constant";

export default function EventDetailView({ id }: { id: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { event, checkins, participants, loading, error } = useAppSelector(
    (s) => s.eventDetail,
  );

  useEffect(() => {
    dispatch(fetchEventDetail(id));
    return () => {
      dispatch(resetEventDetail());
    };
  }, [dispatch, id]);

  return (
    <div className="min-h-screen px-6 py-6" style={{ background: "#080c14" }}>
      <div className="mx-auto max-w-6xl">
        {/* Back button — always visible */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-3 py-1.5 text-sm text-slate-400 transition hover:border-white/15 hover:text-slate-300"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Events
        </button>

        {/* Loading */}
        {loading && <SkeletonDetailPage />}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <svg
                className="h-7 w-7 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.963-.834-2.732 0L4.07 16.5C3.3 17.333 4.262 19 5.8 19z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-red-400">
              Failed to load event
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-500">{error}</p>
            <button
              onClick={() => dispatch(fetchEventDetail(id))}
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty — event returned but no content */}
        {!loading && !error && !event && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/5 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/8">
              <svg
                className="h-7 w-7 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-300">
              Event not found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              This event doesn&apos;t exist or was removed.
            </p>
          </div>
        )}

        {/* Success */}
        {!loading && !error && event && (
          <div className="space-y-6">
            {/* Event Header */}
            <div className="rounded-2xl border border-white/8 bg-white/5 p-6 shadow-lg">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-white">
                    {event.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-2">
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(event.date)}
                    </span>
                  </div>
                </div>
                {/* Status badge */}
                <span
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${STATUS_CONFIG[event.status].badge}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${STATUS_CONFIG[event.status].dot}`}
                  />
                  {STATUS_CONFIG[event.status].label}
                </span>
              </div>
              {event.description && (
                <p className="mt-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  {event.description}
                </p>
              )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Expected"
                value={event.expected_count.toLocaleString()}
                accent="text-slate-300"
                icon={
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Check-ins"
                value={event.checkin_count.toLocaleString()}
                accent="text-blue-400"
                icon={
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Errors"
                value={event.error_count.toLocaleString()}
                accent="text-red-400"
                icon={
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Entry Rate"
                value={`${(event.entry_rate * 100).toFixed(1)}%`}
                accent="text-emerald-400"
                icon={
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                }
              />
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Entries over time */}
              <div className="rounded-2xl border border-white/8 bg-white/5 p-5 shadow-lg">
                <h2 className="mb-1 text-sm font-semibold text-white">
                  Entries Over Time
                </h2>
                <p className="mb-4 text-xs text-slate-500">
                  Successful entries grouped by hour
                </p>
                <EntriesOverTimeChart checkins={checkins} />
              </div>

              {/* Success vs Error proportion */}
              <div className="rounded-2xl border border-white/8 bg-white/5 p-5 shadow-lg">
                <h2 className="mb-1 text-sm font-semibold text-white">
                  Check-in Breakdown
                </h2>
                <p className="mb-4 text-xs text-slate-500">
                  Proportion of successful vs failed check-ins
                </p>
                <CheckinProportionChart checkins={checkins} />
              </div>
            </div>

            {/* Participants table */}
            <ParticipantsTable participants={participants} event={event} />
          </div>
        )}
      </div>
    </div>
  );
}
