import { Checkin, CheckinProportionPoint } from "../types/checkin";

export function buildProportionData(checkins: Checkin[]): CheckinProportionPoint[] {
  const successes = checkins.filter((c) => c.success).length;
  const errors = checkins.filter((c) => !c.success).length;
  const result: CheckinProportionPoint[] = [];
  if (successes > 0) result.push({ name: 'Successful', value: successes, color: '#3b82f6' });
  if (errors > 0) result.push({ name: 'Errors', value: errors, color: '#f87171' });
  return result;
}