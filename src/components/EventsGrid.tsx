'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchEvents, setSearchQuery, setStatusFilter, toggleSortDate } from '@/src/store/eventsSlice';
import { EventStatus } from '@/src/types';
import EventCard from './EventCard';

const STATUS_OPTIONS: { label: string; value: EventStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Closed', value: 'closed' },
  { label: 'Cancelled', value: 'cancelled' },
];

function SortIcon({ dir }: { dir: 'asc' | 'desc' | null }) {
  if (!dir) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  if (dir === 'asc') {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l-4-4m4 4H13" />
    </svg>
  );
}

// Loading skeleton
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/8 bg-white/5 p-5">
      <div className="flex justify-between gap-3">
        <div className="h-4 w-2/3 rounded-lg bg-white/10" />
        <div className="h-5 w-16 rounded-full bg-white/10" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/2 rounded bg-white/8" />
        <div className="h-3 w-2/5 rounded bg-white/8" />
      </div>
      <div className="my-4 h-px bg-white/5" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded bg-white/8" />
          <div className="h-3 w-10 rounded bg-white/8" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded bg-white/8" />
          <div className="h-3 w-10 rounded bg-white/8" />
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/8" />
      </div>
      <div className="mt-5 h-8 w-full rounded-xl bg-white/8" />
    </div>
  );
}

export default function EventsGrid() {
  const dispatch = useAppDispatch();
  const { items, loading, error, searchQuery, statusFilter, sortDateDirection } = useAppSelector(
    (s) => s.events
  );
  const [inputValue, setInputValue] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Debounce search
  const handleSearchChange = (val: string) => {
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setSearchQuery(val));
    }, 350);
  };

  // Derive filtered + sorted events
  const filtered = items
    .filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (!sortDateDirection) return 0;
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDateDirection === 'asc' ? diff : -diff;
    });

  const sortLabel =
    sortDateDirection === 'asc'
      ? 'Date ↑'
      : sortDateDirection === 'desc'
      ? 'Date ↓'
      : 'Sort by Date';

  return (
    <div className="min-h-screen" style={{ background: '#080c14' }}>
      {/* Header */}
      <header className="border-b border-white/8 px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Event Management</h1>
              <p className="text-xs text-slate-500">Monitor and manage all events</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search events..."
              className="w-full rounded-xl border border-white/8 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:bg-white/8 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>

          {/* Sort by Date */}
          <button
            onClick={() => dispatch(toggleSortDate())}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              sortDateDirection
                ? 'border-blue-500/50 bg-blue-500/15 text-blue-400'
                : 'border-white/8 bg-white/5 text-slate-400 hover:border-white/15 hover:text-slate-300'
            }`}
          >
            <SortIcon dir={sortDateDirection} />
            {sortLabel}
          </button>

          {/* Status Filter */}
          <div className="flex rounded-xl border border-white/8 bg-white/5 p-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => dispatch(setStatusFilter(opt.value))}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  statusFilter === opt.value
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="mb-4 text-xs text-slate-500">
            {filtered.length} {filtered.length === 1 ? 'event' : 'events'} found
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 mb-4">
              <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.963-.834-2.732 0L4.07 16.5C3.3 17.333 4.262 19 5.8 19z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-red-400">Failed to load events</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-xs">{error}</p>
            <button
              onClick={() => dispatch(fetchEvents())}
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/5 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/8 mb-4">
              <svg className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-300">No events found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No events are available right now'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setInputValue('');
                  dispatch(setSearchQuery(''));
                  dispatch(setStatusFilter('all'));
                }}
                className="mt-4 rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-slate-400 transition hover:text-slate-300"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
