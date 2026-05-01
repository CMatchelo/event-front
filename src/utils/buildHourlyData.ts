import { Checkin, HourlyEntryPoint } from "../types/checkin";

export function buildHourlyData(checkins: Checkin[]): HourlyEntryPoint[] {
  // Only successful entries
  const entries = checkins.filter((c) => c.success && c.action === "entry");
  if (entries.length === 0) return [];

  const buckets: Record<string, number> = {};

  entries.forEach((c) => {
    const d = new Date(c.timestamp);
    const hour = `${String(d.getHours()).padStart(2, "0")}:00`;
    buckets[hour] = (buckets[hour] ?? 0) + 1;
  });

  const hours = Object.keys(buckets).sort();
  const first = parseInt(hours[0]);
  const last = parseInt(hours[hours.length - 1]);
  const result: HourlyEntryPoint[] = [];
  for (let h = first; h <= last; h++) {
    const key = `${String(h).padStart(2, "0")}:00`;
    result.push({ hour: key, entries: buckets[key] ?? 0 });
  }
  return result;
}
