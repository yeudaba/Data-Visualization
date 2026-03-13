import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import KpiCard from "../components/KpiCard";
import Sidebar from "../components/Sidebar";

function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function randInt(seed, min, max) {
  const r = seededRand(seed);
  return Math.floor(min + r * (max - min + 1));
}
function trendFromDelta(deltaPct) {
  if (deltaPct > 0) return { type: "up", text: `+${deltaPct}% לעומת חודש קודם` };
  if (deltaPct < 0) return { type: "down", text: `${deltaPct}% לעומת חודש קודם` };
  return { type: "neutral", text: "ללא שינוי" };
}

function GroupCard({ title, icon: Icon, iconClassName = "", items }) {
  return (
    <div className="rounded-[32px] bg-[#3b3e47] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.40)]">
      <div className="flex items-center justify-center gap-2 text-center text-xl font-extrabold text-white">
        {Icon ? <Icon className={`text-2xl ${iconClassName}`} /> : null}
        <span>{title}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {items.map((it) => (
          <KpiCard
            key={it.title}
            title={it.title}
            value={it.value}
            trendText={it.trend.text}
            trendType={it.trend.type}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const data = useMemo(() => {
    const seedBase = 42;

    const totalKids = randInt(seedBase + 1, 80, 220);
    const newKids = randInt(seedBase + 2, 20, 120);
    const treatedKids = randInt(seedBase + 3, 10, 80);
    const closedKids = randInt(seedBase + 4, 10, 80);

    const totalSales = randInt(seedBase + 5, 8, 40);
    const newSales = randInt(seedBase + 6, 3, 20);
    const refunds = randInt(seedBase + 7, 0, 10);
    const conversion = randInt(seedBase + 8, 10, 35);

    const totalMeetings = randInt(seedBase + 9, 20, 80);
    const todayMeetings = randInt(seedBase + 10, 0, 15);
    const futureMeetings = randInt(seedBase + 11, 0, 20);
    const canceledMeetings = randInt(seedBase + 12, 0, 10);

    const d = Array.from({ length: 12 }, (_, i) => randInt(seedBase + 20 + i, -12, 12));

    return {
      kids: [
        { title: 'סה"כ לידים', value: totalKids, trend: trendFromDelta(d[0]) },
        { title: "לידים חדשים החודש", value: newKids, trend: trendFromDelta(d[1]) },
        { title: "לידים בטיפול", value: treatedKids, trend: trendFromDelta(d[2]) },
        { title: "לידים סגורים", value: closedKids, trend: trendFromDelta(d[3]) },
      ],
      sales: [
        { title: 'סה"כ מכירות', value: totalSales, trend: trendFromDelta(d[4]) },
        { title: "מכירות חדשות", value: newSales, trend: trendFromDelta(d[5]) },
        { title: "החזרים", value: refunds, trend: trendFromDelta(d[6]) },
        { title: "אחוז המרה", value: `${conversion}%`, trend: trendFromDelta(d[7]) },
      ],
      meetings: [
        { title: 'סה"כ פגישות', value: totalMeetings, trend: trendFromDelta(d[8]) },
        { title: "פגישות היום", value: todayMeetings, trend: trendFromDelta(d[9]) },
        { title: "פגישות עתידיות", value: futureMeetings, trend: trendFromDelta(d[10]) },
        { title: "פגישות שבוטלו", value: canceledMeetings, trend: trendFromDelta(d[11]) },
      ],
    };
  }, []);

  const updatedAt = useMemo(() => {
    const now = new Date();
    const time = now.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const date = now.toLocaleDateString("he-IL");
    return `${time}, ${date}`;
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-[#2e3038] text-white">
      <Sidebar isOpen={menuOpen} onToggle={() => setMenuOpen((s) => !s)} />

      <div className="mx-auto max-w-6xl px-6 pt-8">
        {/* TOP BAR */}
        <div className="grid grid-cols-3 items-start">
          {/* Left: burger + personal area together */}
          <div className="justify-self-start">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="rounded-full p-3 text-white/90 hover:bg-white/10 -mt-2"
                aria-label="פתיחת תפריט"
              >
                <span className="text-2xl leading-none">≡</span>
              </button>
              
              {/*<div className="text-right mt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-bold text-slate-900 shadow-sm"
                >
                  אזור אישי
                </Link>
                <div className="mt-2 text-xs text-white/70">
                  כניסת מנהל מערכת / הנהלת קמפוס
                </div>
              </div>*/}

            </div>
          </div>

          {/* Center: logo with WHITE background */}
          <div className="justify-self-center text-center">
            <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-black/10">
              <img
                src="/SCE_logo.png"
                alt="SCE"
                className="h-10 w-auto"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <div className="mt-2 text-[12px] text-white/75">
              המכללה האקדמית להנדסה ע״ש סמי שמעון
            </div>
          </div>

          {/* Right: empty for symmetry */}
          <div className="justify-self-end" />
        </div>

        {/* Title with icon */}
        <div className="mt-8 text-center">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-extrabold tracking-tight">
            <HiOutlineChartBar className="text-4xl text-sky-300" />
            סיכום פעילויות מחלקת הרישום
          </h1>
          <p className="mt-2 text-sm text-white/75">
            תצוגה מרוכזת של לידים, פגישות ומכירות – בזמן כמעט אמת.
          </p>
        </div>

        {/* 3 group cards + icons */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <GroupCard
            title="לידים"
            icon={HiOutlineUserGroup}
            iconClassName="text-sky-300"
            items={data.kids}
          />
          <GroupCard
            title="מכירות"
            icon={HiOutlineCurrencyDollar}
            iconClassName="text-emerald-300"
            items={data.sales}
          />
          <GroupCard
            title="פגישות"
            icon={HiOutlineCalendarDays}
            iconClassName="text-indigo-300"
            items={data.meetings}
          />
        </div>

        <div className="mt-8 text-right text-xs text-white/60">
          נתונים מעודכנים ל- {updatedAt}
        </div>

        <div className="pb-16" />
      </div>
    </div>
  );
}