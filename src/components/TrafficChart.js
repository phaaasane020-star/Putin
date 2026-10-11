"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TrafficChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E71" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#F59E71" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#002B4C" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#002B4C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#C0EBFF" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#4a6a85" }} tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#4a6a85" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 8px 30px rgba(0,43,76,.18)" }} />
          <Area type="monotone" dataKey="views" name="Page views" stroke="#F59E71" strokeWidth={2.5} fill="url(#gViews)" />
          <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#002B4C" strokeWidth={2.5} fill="url(#gVisitors)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
