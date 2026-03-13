import React from "react";

export default function KpiCard({ title, value, trendText, trendType = "neutral" }) {
  const trendStyles =
    trendType === "up"
      ? "bg-emerald-50 text-emerald-700"
      : trendType === "down"
      ? "bg-rose-50 text-rose-700"
      : "bg-slate-100 text-slate-600";

  return (
    <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-sm ring-1 ring-black/5">
      {/* Title */}
      <div className="text-center text-sm font-bold text-slate-700 leading-snug min-h-[38px] flex items-center justify-center">
        {title}
      </div>

      {/* Value */}
      <div className="mt-2 flex items-center justify-center">
        <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
          {value}
        </div>
      </div>

      {/* Trend pill */}
      <div className="mt-3 flex items-center justify-center">
        <div className={`rounded-full px-4 py-2 text-xs font-semibold ${trendStyles}`}>
          {trendText}
        </div>
      </div>
    </div>
  );
}
