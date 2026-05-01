"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Checkin } from "../types/checkin";
import { buildHourlyData } from "../utils/buildHourlyData";
import { CustomTooltip } from "./CustomTooltip";

export default function EntriesOverTimeChart({
  checkins,
}: {
  checkins: Checkin[];
}) {
  const data = buildHourlyData(checkins);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
        <p className="text-sm text-slate-500">No entry data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="entryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="hour"
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "rgba(59,130,246,0.3)", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="entries"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#entryGradient)"
          dot={false}
          activeDot={{
            r: 4,
            fill: "#3b82f6",
            stroke: "#080c14",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
