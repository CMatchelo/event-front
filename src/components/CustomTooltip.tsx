import { TooltipPayloadEntry } from "recharts";
import { CheckinPayload } from "../types/TooltipPayload";


interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function isCheckinPayload(item: TooltipPayloadEntry): item is TooltipPayloadEntry & CheckinPayload {
  return "name" in item && "payload" in item;
}

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  if (isCheckinPayload(item)) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0d1220] px-3 py-2 text-sm shadow-xl">
        <p style={{ color: item.payload.color }} className="font-semibold">
          {item.name}
        </p>
        <p className="text-slate-300">{item.value} check-ins</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1220] px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-400">{label}</p>
      <p className="font-semibold text-blue-400">{item.value} entries</p>
    </div>
  );
}
