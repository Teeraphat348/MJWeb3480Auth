"use client";

import { signIn, signOut } from "next-auth/react";

type AuthButtonsProps = {
  isLoggedIn?: boolean;
  userName?: string | null;
};

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">
          สวัสดี {userName ?? "ผู้ใช้งาน"}
        </span>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-sm"
    >
      Login
    </button>
  );
}