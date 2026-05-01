'use client';

import { Event } from '@/src/types';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  },
  closed: {
    label: 'Closed',
    dot: 'bg-slate-400',
    badge: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  },
  cancelled: {
    label: 'Cancelled',
    dot: 'bg-red-400',
    badge: 'bg-red-400/10 text-red-400 border-red-400/20',
  },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CheckinBar({ checkin, expected }: { checkin: number; expected: number }) {
  const pct = expected > 0 ? Math.min((checkin / expected) * 100, 100) : 0;
  return (
    <div className="mt-1 h-1.5 w-full rounded-full bg-white/5">
      <div
        className="h-1.5 rounded-full bg-blue-500 transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  const cfg = STATUS_CONFIG[event.status];
  const checkinPct =
    event.expected_count > 0
      ? ((event.checkin_count / event.expected_count) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="group flex flex-col rounded-2xl border border-white/8 bg-white/5 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-white/8 hover:shadow-blue-500/10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-white leading-tight line-clamp-2 text-base">
          {event.name}
        </h2>
        <span
          className={`shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 space-y-1.5 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <svg className="h-3.5 w-3.5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-3.5 w-3.5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{event.location}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-white/5" />

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Expected</span>
          <span className="font-medium text-white">{event.expected_count.toLocaleString()}</span>
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Check-ins</span>
            <span className="font-medium text-blue-400">
              {event.checkin_count.toLocaleString()}
              <span className="ml-1 text-xs text-slate-500">({checkinPct}%)</span>
            </span>
          </div>
          <CheckinBar checkin={event.checkin_count} expected={event.expected_count} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-1">
        <button
          onClick={() => router.push(`/events/${event.id}`)}
          className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition-all duration-200 hover:border-blue-500/60 hover:bg-blue-500/20 hover:text-blue-300 active:scale-[0.98]"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
