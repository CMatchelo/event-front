import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { useToast } from "../components/ToastProvider";
import { optimisticCheckin, performCheckin } from "../store/eventDetailSlice";
import { canCheckin, canCheckout } from "../utils/CheckinUtils";
import { AppEvent } from "../types/Event";
import { Participant } from "../types/Participant";

export type CheckinLoadingState = "entry" | "exit" | null;

export function useParticipantCheckin(participant: Participant, event: AppEvent) {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const [loading, setLoading] = useState<CheckinLoadingState>(null);

  const handleCheckin = async () => {
    const { allowed, reason } = canCheckin(participant, event);
    if (!allowed) {
      addToast(reason!, "error");
      return;
    }

    setLoading("entry");
    dispatch(optimisticCheckin({ participantId: participant.id, newStatus: "inside" }));

    try {
      await dispatch(
        performCheckin({ eventId: event.id, participantId: participant.id, action: "entry" }),
      ).unwrap();

      if (participant.type === "vip") {
        addToast("Entry registered successfully", "success");
      } else {
        addToast("Check-in registered. No further check-ins allowed", "success");
      }
    } catch {
      addToast("Failed to register check-in. Please try again.", "error");
      dispatch(optimisticCheckin({ participantId: participant.id, newStatus: "outside" }));
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
    dispatch(optimisticCheckin({ participantId: participant.id, newStatus: "outside" }));

    try {
      await dispatch(
        performCheckin({ eventId: event.id, participantId: participant.id, action: "exit" }),
      ).unwrap();

      if (participant.type === "vip") {
        addToast("Exit registered. Participant may re-enter", "success");
      } else {
        addToast("Exit registered", "success");
      }
    } catch {
      addToast("Failed to register check-out. Please try again.", "error");
      dispatch(optimisticCheckin({ participantId: participant.id, newStatus: "inside" }));
    } finally {
      setLoading(null);
    }
  };

  return { loading, handleCheckin, handleCheckout };
}
