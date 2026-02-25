"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAllNotificationsRead, useMockStore } from "@/app/dashBoardTest/_lib/mockStore";
import { fromNow } from "@/app/dashBoardTest/_lib/format";

export default function NotificationsSheet({ open, onOpenChange }) {
  const notifications = useMockStore((state) => state.notifications);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 bg-slate-900/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-950"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
              </div>
              <button
                type="button"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-4" />
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={markAllNotificationsRead} className="mb-4">
              <CheckCheck className="size-4" />
              Mark all as read
            </Button>

            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 ${
                    item.read
                      ? "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900"
                      : "border-cyan-200 bg-cyan-50 dark:border-cyan-500/30 dark:bg-cyan-500/10"
                  }`}
                >
                  <p className="text-sm text-slate-800 dark:text-slate-100">{item.text}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{fromNow(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
