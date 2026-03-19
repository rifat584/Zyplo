import { motion } from "framer-motion";

export function BentoCard({ title, right, className = "", children, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.2, delay, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={[
        "group relative overflow-hidden rounded-2xl p-px",
        "bg-linear-to-br from-indigo-500/50 via-zinc-200/90 to-cyan-400/45 dark:from-indigo-400/55 dark:via-slate-600 dark:to-cyan-300/55",
        "transition-shadow duration-300 hover:shadow-[0_12px_32px_-12px_rgba(79,70,229,0.45)] dark:hover:shadow-[0_14px_34px_-14px_rgba(34,211,238,0.38)]",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-x-8 top-0 h-16 bg-linear-to-b from-cyan-400/40 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/0 via-cyan-400/0 to-cyan-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-indigo-500/30 group-hover:via-cyan-400/18 group-hover:to-cyan-400/24" />
      <div className="relative h-full rounded-2xl bg-white/92 p-4 shadow-sm transition-shadow duration-300 group-hover:shadow-[inset_0_0_0_1px_rgba(79,70,229,0.36)] dark:bg-[#0E1733]/92 dark:group-hover:shadow-[inset_0_0_0_1px_rgba(34,211,238,0.48)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-gray-100">{title}</h3>
          {right}
        </div>
        {children}
      </div>
    </motion.article>
  );
}
