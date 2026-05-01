import { AppEvent } from "./Event";

export type EventStatus = 'active' | 'closed' | 'cancelled';
export type SortDirection = 'asc' | 'desc' | null;

export interface EventsState {
  items: AppEvent[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: EventStatus | 'all';
  sortDateDirection: SortDirection;
}
