import { AppEvent } from "../types/Event";
import { Participant } from "../types/Participant";

export function canCheckin(participant: Participant, event: AppEvent): { allowed: boolean; reason?: string } {
  if (event.status === 'closed') {
    return { allowed: false, reason: 'Event is closed. No check-ins allowed' };
  }
  if (participant.type === 'normal' && participant.checkin_count >= 1) {
    return { allowed: false, reason: 'Participant has already checked in' };
  }
  return { allowed: true };
}

export function canCheckout(participant: Participant, event: AppEvent): { allowed: boolean; reason?: string } {
  if (event.status === 'closed') {
    return { allowed: false, reason: 'Event is closed. No check-ins allowed' };
  }
  if (participant.status !== 'inside') {
    return { allowed: false, reason: 'Participant is not inside the event' };
  }
  return { allowed: true };
}