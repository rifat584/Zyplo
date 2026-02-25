"use client";

import { useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar } from "./ui";
import { useMockStore } from "./mockStore";
import { signOut, useSession } from "next-auth/react";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const user = useMockStore((state) => state.currentUser);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };
  return (
    <div className="relative">
      <button
        type="button"
        className="rounded-full p-0.5 ring-2 ring-transparent transition hover:ring-cyan-200 dark:hover:ring-cyan-500/40"
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar name={user.name} />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-30 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-slate-900">
          <div className="mb-2 border-b border-slate-200 pb-2 dark:border-white/10">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {session.user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {session.user.email}
            </p>
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <User className="size-4" />
            Profile
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Settings className="size-4" />
            Preferences
          </button>
          <button
            onClick={handleLogout}
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
