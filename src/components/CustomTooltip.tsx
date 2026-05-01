import { CheckinProportionPoint } from "../types/checkin";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: CheckinProportionPoint }[];
}

export function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1220] px-3 py-2 text-sm shadow-xl">
      <p style={{ color: item.payload.color }} className="font-semibold">
        {item.name}
      </p>
      <p className="text-slate-300">{item.value} check-ins</p>
    </div>
  );
}