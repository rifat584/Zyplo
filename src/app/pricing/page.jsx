"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  KanbanSquare,
  PanelRightOpen,
  TimerReset,
  Bot,
  SearchCheck,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import MainContainer from "@/components/container/MainContainer";
import Link from "next/link";
import PricingCtaBanner from "@/components/Pricing/PricingCtaBanner";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import PricingCard from "@/components/Pricing/PricingCard";

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "For solo developers building and shipping quickly.",
    monthlyPrice: 12,
    yearlyPrice: 10,
    highlight: false,
    features: [
      "1 workspace",
      "Unlimited personal boards",
      "Basic automation rules",
      "Email support",
    ],
    cta: "Start Starter",
  },
  {
    id: "team",
    name: "Team",
    description: "For product teams that need speed and visibility.",
    monthlyPrice: 29,
    yearlyPrice: 23,
    highlight: true,
    features: [
      "Up to 20 members",
      "Advanced automation",
      "Time tracking and worklog",
      "Priority support",
    ],
    cta: "Start Team",
  },
  {
    id: "studio",
    name: "Studio",
    description: "For agencies managing multiple clients and projects.",
    monthlyPrice: 59,
    yearlyPrice: 47,
    highlight: false,
    features: [
      "Unlimited client spaces",
      "Permissions and roles",
      "Invoice-friendly exports",
      "Dedicated success support",
    ],
    cta: "Contact sales",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <main className="bg-white pb-20">
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.14),transparent_36%)]" />

        <MainContainer className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Pricing
            </h1>
            <p className="mt-5 text-lg text-gray-600">
              Zyplo helps web developers plan, track, and ship work with less
              friction and better team flow.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-secondary px-6 py-3 font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-secondary/90"
              >
                Start free
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-100"
              >
                Contact sales
              </Link>
            </div>
          </motion.div>
        </MainContainer>
      </section>

      <section className="py-12">
        <MainContainer className="px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-1 sm:w-auto">
              <button
                onClick={() => setYearly(false)}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                  yearly ? "text-gray-600" : "bg-white text-gray-900 shadow-sm"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                  yearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                Yearly
                {yearly && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Save 20%
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} yearly={yearly} />
            ))}
          </div>
        </MainContainer>
      </section>

      <section className="py-14">
        <PricingFAQ />
      </section>

      <section className="py-8">
        <PricingCtaBanner />
      </section>
    </main>
  );
}
