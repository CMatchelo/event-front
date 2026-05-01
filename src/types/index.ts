export type EventStatus = 'active' | 'closed' | 'cancelled';
export type ParticipantType = 'vip' | 'normal';
export type ParticipantStatus = 'inside' | 'outside';
export type SortDirection = 'asc' | 'desc' | null;

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
  description: string;
  expected_count: number;
  checkin_count: number;
  error_count: number;
  entry_rate: number;
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  type: ParticipantType;
  status: ParticipantStatus;
  checkin_count: number;
}

export interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: EventStatus | 'all';
  sortDateDirection: SortDirection;
}
