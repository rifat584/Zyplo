import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FeatureMiniMock } from "./FeatureMiniMock";

export function FeatureHighlightCard({ tile, delay = 0, className = "" }) {
  // Icons are passed in data as component references (e.g. lucide icon functions).
  const Icon = tile.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      // `delay` is controlled by parent map index to create a predictable stagger.
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={className}
    >
      <Card className="h-full rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-indigo-500/5 via-white to-cyan-400/5 p-6 shadow-sm backdrop-blur transition hover:-translate-y-[2px] hover:shadow-md">
        <div className="flex h-full flex-col">
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-200/70 bg-indigo-50 text-indigo-600">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900">{tile.title}</h3>
          <p className="mt-1 text-sm text-zinc-600">{tile.description}</p>
          <div className="mt-4 flex-1 overflow-hidden">
            <FeatureMiniMock mockType={tile.mockType} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
