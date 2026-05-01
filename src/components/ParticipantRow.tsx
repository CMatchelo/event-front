import { useAppDispatch } from "../store/hooks";
import { useToast } from "./ToastProvider";
import { optimisticCheckin, performCheckin } from "../store/eventDetailSlice";
import { AppEvent } from "../types/Event";
import { canCheckin, canCheckout } from "../utils/CheckinUtils";
import { Participant } from "../types/Participant";
import { useState } from "react";

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
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const [loading, setLoading] = useState<"entry" | "exit" | null>(null);

  const handleCheckin = async () => {
    const { allowed, reason } = canCheckin(participant, event);
    if (!allowed) {
      addToast(reason!, "error");
      return;
    }

    setLoading("entry");
    // Optimistic update
    dispatch(
      optimisticCheckin({ participantId: participant.id, newStatus: "inside" }),
    );

    try {
      await dispatch(
        performCheckin({
          eventId: event.id,
          participantId: participant.id,
          action: "entry",
        }),
      ).unwrap();

      if (participant.type === "vip") {
        addToast("Entry registered successfully", "success");
      } else {
        addToast(
          "Check-in registered. No further check-ins allowed",
          "success",
        );
      }
    } catch {
      addToast("Failed to register check-in. Please try again.", "error");
      // Revert optimistic update
      dispatch(
        optimisticCheckin({
          participantId: participant.id,
          newStatus: "outside",
        }),
      );
    } finally {
      setLoading(null);
    }
  };

  const handleCheckout = async () => {
    const { allowed, reason } = canCheckout(participant, event);
    if (!allowed) {
      addToast(reason!, "error");
      return;
    }

    setLoading("exit");
    dispatch(
      optimisticCheckin({
        participantId: participant.id,
        newStatus: "outside",
      }),
    );

    try {
      await dispatch(
        performCheckin({
          eventId: event.id,
          participantId: participant.id,
          action: "exit",
        }),
      ).unwrap();

      if (participant.type === "vip") {
        addToast("Exit registered. Participant may re-enter", "success");
      } else {
        addToast("Exit registered", "success");
      }
    } catch {
      addToast("Failed to register check-out. Please try again.", "error");
      dispatch(
        optimisticCheckin({
          participantId: participant.id,
          newStatus: "inside",
        }),
      );
    } finally {
      setLoading(null);
    }
  };

  const checkinBlocked =
    event.status === "closed" ||
    event.status === "cancelled" ||
    (participant.type === "normal" && participant.checkin_count >= 1);
  const checkoutBlocked =
    event.status === "closed" || participant.status !== "inside";

  return (
    <tr className="border-t border-white/5 transition-colors hover:bg-white/3">
      {/* Name */}
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-white">
          {participant.name}
        </span>
      </td>

      {/* Type */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${TYPE_STYLES[participant.type]}`}
        >
          {participant.type}
        </span>
      </td>

      {/* Status */}
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

      {/* Check-in count */}
      <td className="px-4 py-3 text-center">
        <span className="text-sm text-slate-400">
          {participant.checkin_count}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Check-in */}
          <button
            onClick={handleCheckin}
            disabled={!!loading || checkinBlocked}
            title={
              checkinBlocked && event.status !== "closed"
                ? "Already checked in"
                : undefined
            }
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150
              ${
                checkinBlocked
                  ? "cursor-not-allowed border-white/5 bg-white/3 text-slate-600"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/20 active:scale-95"
              }`}
          >
            {loading === "entry" ? (
              <svg
                className="h-3 w-3 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
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

          {/* Check-out */}
          <button
            onClick={handleCheckout}
            disabled={!!loading || checkoutBlocked}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150
              ${
                checkoutBlocked
                  ? "cursor-not-allowed border-white/5 bg-white/3 text-slate-600"
                  : "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/20 active:scale-95"
              }`}
          >
            {loading === "exit" ? (
              <svg
                className="h-3 w-3 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
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
