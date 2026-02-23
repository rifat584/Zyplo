import { motion } from "framer-motion";

export function FeatureTile({ label, icon: Icon, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={[
        "group flex h-24 items-center gap-2.5 rounded-xl border bg-white/70 p-4 text-sm font-medium text-zinc-800 backdrop-blur transition hover:-translate-y-[2px] hover:shadow-md border-red-400",
        className,
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="truncate">{label}</span>
    </motion.div>
  );
}
