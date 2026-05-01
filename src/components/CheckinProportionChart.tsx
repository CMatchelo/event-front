"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { Checkin } from "../types/checkin";
import { buildProportionData } from "../utils/buildProportionData";
import { CustomTooltip } from "./CustomTooltip";
import { CustomLegend } from "./CustomLegend";

export default function CheckinProportionChart({
  checkins,
}: {
  checkins: Checkin[];
}) {
  const data = buildProportionData(checkins);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
        <p className="text-sm text-slate-500">No check-in data available</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingBottom: "30px" }}
      >
        <span className="text-2xl font-bold text-white">{total}</span>
        <span className="text-xs text-slate-500">total</span>
      </div>
    </div>
  );
}
