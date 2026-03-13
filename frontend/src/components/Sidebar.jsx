import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  TrendingUp,
  MapPinned,
  LineChart,
  FileText,
  X,
} from "lucide-react";

const menuItems = [
  { label: "דף הבית", to: "/home", Icon: Home },
  { label: "דוח 1 – השוואת נרשמים לפי חודשים / שנים", to: "/report1", Icon: TrendingUp },
  { label: "דוח 2 – ביקושי המחלקות של הנרשמים למכללה בהשוואה לשנים האחרונות", to: "/report2", Icon: BarChart3 },
  { label: "דוח 3 – שמות היישובים של הנרשמים לשנה״ל בחודש זה על פי המחלקה וקמפוס", to: "/report3", Icon: MapPinned },
  { label: "דוח 4 – ניתוח הגעה למפגש ייעוץ", to: "/report4", Icon: LineChart },
  { label: "דוח 5 - ניתוח לידים ומידה", to: "/report5", Icon: FileText },
];

export default function Sidebar({ isOpen, onToggle }) {
  const { pathname } = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onToggle}
      />

      <div className="absolute right-0 top-0 h-full w-[340px] bg-[#0b1220] text-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-extrabold">התפריט</div>
              <div className="mt-1 text-white/60">ניווט בין הדוחות והתצוגות</div>
            </div>

            <button
              onClick={onToggle}
              className="rounded-xl p-2 hover:bg-white/10"
              aria-label="סגירה"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-8 space-y-3">
            {menuItems.map(({ label, to, Icon }) => {
              const active = pathname === to;

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onToggle}
                  className={[
                    "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                    active ? "bg-white/10 ring-1 ring-white/15" : "hover:bg-white/5",
                  ].join(" ")}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <Icon className="h-5 w-5 text-sky-200" />
                  </div>

                  <div className="text-sm leading-snug">{label}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}