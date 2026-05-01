export type EventStatus = 'active' | 'closed' | 'cancelled';

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
