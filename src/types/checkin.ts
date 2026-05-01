export type CheckinAction = 'entry' | 'exit';
export type CheckinErrorReason = 'already_checked_in' | 'event_closed' | null;

export interface Checkin {
  id: string;
  event_id: string;
  participant_id: string;
  timestamp: string;
  success: boolean;
  action: CheckinAction;
  error_reason: CheckinErrorReason;
}

// Derived type for chart data — groups checkins by hour bucket
export interface HourlyEntryPoint {
  hour: string;       // e.g. "14:00"
  entries: number;    // successful entries in that hour
}

// Aggregated success/error proportion for the pie/donut chart
export interface CheckinProportionPoint {
  name: string;
  value: number;
  color: string;
}
