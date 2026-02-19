"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MainContainer from "@/components/container/MainContainer";
import Link from "next/link";
import PricingCard from "@/components/Pricing/PricingCard";
import pricingPlans from "@/lib/pricingPlans.json";


export default function PricingPage() {
  const [yearly, setYearly] = useState(true);

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
                href="/login"
                className="rounded-lg bg-linear-to-br from-indigo-500 to-cyan-400 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-secondary/90"
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
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} yearly={yearly} />
            ))}
          </div>
        </MainContainer>
      </section>

      <section className="py-8">
        <MainContainer className="px-6">
          <div className="rounded-2xl border border-gray-200 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.14),transparent_36%)] p-8 sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Ready to ship faster with Zyplo?
                </h2>
                <p className="mt-3 text-gray-600">
                  Start free today or talk with sales for a team setup that fits
                  your workflow.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-lg bg-linear-to-br from-indigo-500 to-cyan-400 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary/90"
                >
                  Start free
                </Link>
                <a
                  href="/contact"
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  Contact sales
                </a>
              </div>
            </div>
          </div>
        </MainContainer>
      </section>
    </main>
  );
}
