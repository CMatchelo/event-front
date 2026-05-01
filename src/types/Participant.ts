export type ParticipantType = 'vip' | 'normal';
export type ParticipantStatus = 'inside' | 'outside';

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  type: ParticipantType;
  status: ParticipantStatus;
  checkin_count: number;
}
