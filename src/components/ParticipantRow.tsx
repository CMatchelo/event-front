import { AppEvent } from "../types/Event";
import { Participant } from "../types/Participant";
import { useParticipantCheckin } from "../hooks/useParticipantCheckin";
import { canCheckin, canCheckout } from "../utils/CheckinUtils";
import { SpinnerIcon } from "./SpinnerIcon";

const TYPE_STYLES = {
  vip: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  normal: "bg-slate-400/10 text-slate-400 border-slate-400/20",
};

const STATUS_STYLES = {
  inside: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  outside: "bg-slate-600/20 text-slate-400 border-slate-600/20",
};

interface ParticipantRowProps {
  participant: Participant;
  event: AppEvent;
}

export function ParticipantRow({ participant, event }: ParticipantRowProps) {
  const { loading, handleCheckin, handleCheckout } = useParticipantCheckin(
    participant,
    event,
  );

  const checkinBlocked = !canCheckin(participant, event).allowed;
  const checkoutBlocked = !canCheckout(participant, event).allowed;

  return (
    <tr className="border-t border-white/5 transition-colors hover:bg-white/3">
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-white">
          {participant.name}
        </span>
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${TYPE_STYLES[participant.type]}`}
        >
          {participant.type}
        </span>
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[participant.status]}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${participant.status === "inside" ? "bg-emerald-400" : "bg-slate-500"}`}
          />
          {participant.status === "inside" ? "Inside" : "Outside"}
        </span>
      </td>

      <td className="px-4 py-3 text-center">
        <span className="text-sm text-slate-400">
          {participant.checkin_count}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCheckin}
            disabled={!!loading || checkinBlocked}
            title={
              checkinBlocked && event.status !== "closed"
                ? "Already checked in"
                : undefined
            }
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${checkinBlocked ? "cursor-not-allowed border-white/5 bg-white/3 text-slate-600" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/20 active:scale-95"}`}
          >
            {loading === "entry" ? (
              <SpinnerIcon />
            ) : (
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            )}
            Check-in
          </button>

          <button
            onClick={handleCheckout}
            disabled={!!loading || checkoutBlocked}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${checkoutBlocked ? "cursor-not-allowed border-white/5 bg-white/3 text-slate-600" : "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/20 active:scale-95"}`}
          >
            {loading === "exit" ? (
              <SpinnerIcon />
            ) : (
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            )}
            Check-out
          </button>
        </div>
      </td>
    </tr>
  );
}
