export type CheckinPayload = {
  name: string;
  value: number;
  payload: { color: string };
};

export type EntriesPayload = {
  value: number;
};

export type TooltipPayload = CheckinPayload | EntriesPayload;