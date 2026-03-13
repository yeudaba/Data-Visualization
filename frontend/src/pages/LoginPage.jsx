import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function LoginPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // כרגע רק תצוגה ראשונית
    // אחר כך אפשר לחבר לבדיקה אמיתית
    console.log("Login attempt:", { username, password });

    // דוגמה: אחרי כניסה מחזירים לדף הבית
    // או לדף אזור אישי בהמשך
    navigate("/");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#2e3038] text-white">
      <Sidebar isOpen={menuOpen} onToggle={() => setMenuOpen((prev) => !prev)} />

      <div className="mx-auto max-w-7xl px-6 pt-8 pb-14">
        {/* Header */}
        <div className="grid grid-cols-3 items-start">
          <div className="justify-self-start">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-3 text-white/90 hover:bg-white/10 -mt-2"
              aria-label="פתיחת תפריט"
            >
              <span className="text-2xl leading-none">≡</span>
            </button>
          </div>

          <div className="justify-self-center text-center">
            <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-black/10">
              <img
                src="/SCE_logo.png"
                alt="SCE"
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="mt-2 text-[12px] text-white/75">
              המכללה האקדמית להנדסה ע״ש סמי שמעון
            </div>
          </div>

          <div />
        </div>

        {/* Title */}
        <div className="mt-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">כניסה למערכת</h1>
          <p className="mt-3 text-white/70">
            הזן שם משתמש וסיסמה כדי להיכנס לאזור האישי
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-md rounded-[28px] bg-[#3b3e47] p-8 shadow-[0_18px_55px_rgba(0,0,0,0.35)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/85">
                  שם משתמש
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="הזן שם משתמש"
                  className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/85">
                  סיסמה
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="הזן סיסמה"
                  className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-white px-4 py-3 text-lg font-bold text-[#2e3038] transition hover:bg-slate-200"
              >
                כניסה
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}