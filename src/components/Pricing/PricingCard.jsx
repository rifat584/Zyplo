import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import React from "react";

function PricingCard({ plan, yearly }) {
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border p-6 shadow-sm transition-all ${
        plan.highlight
          ? "border-primary bg-linear-to-b from-primary/5 to-white shadow-lg"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
          <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
        </div>
        {plan.highlight && (
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-sm font-semibold text-primary text-center">
            Most Popular
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-4xl font-bold tracking-tight text-gray-900">
          ${price}
          <span className="ml-1 text-base font-medium text-gray-500">/mo</span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {yearly ? "billed yearly" : "billed monthly"}
        </p>
      </div>

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-gray-700"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
          plan.highlight
            ? "bg-secondary text-white hover:bg-secondary/90"
            : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
        }`}
      >
        {plan.cta}
      </button>
    </motion.article>
  );
}

export default PricingCard;
