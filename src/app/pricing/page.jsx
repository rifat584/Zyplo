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

const includedFeatures = [
  {
    title: "Kanban workflow",
    description: "Move tasks across columns with clear ownership and status.",
    icon: KanbanSquare,
  },
  {
    title: "Task detail drawer",
    description: "Open full context without leaving your board flow.",
    icon: PanelRightOpen,
  },
  {
    title: "Time Tracking & Worklog",
    description: "Start/stop timer and auto-save `timeSpent` per task.",
    icon: TimerReset,
  },
  {
    title: "Smart Automation",
    description: "Overdue tasks auto-escalate to high priority with red state.",
    icon: Bot,
  },
  {
    title: "Global Search + Filtering",
    description: "Find anything fast with command palette using Ctrl+K.",
    icon: SearchCheck,
  },
];

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel anytime from billing settings and your plan stays active until the current period ends.",
  },
  {
    question: "Do you offer yearly discount?",
    answer:
      "Yes, yearly billing gives 20% savings compared to monthly pricing.",
  },
  {
    question: "What counts as a team member?",
    answer:
      "Any active user invited to your workspace with access to boards or tasks counts as a member.",
  },
  {
    question: "Do you have a free plan?",
    answer:
      "Yes. Starter includes a free trial and you can keep a limited workspace for personal use.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We use encrypted transport, secure storage, and role-based permissions to protect your workspace data.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes. You can upgrade or downgrade at any time and billing adjusts to the next cycle.",
  },
  {
    question: "Do you offer invoices for teams?",
    answer:
      "Yes. Team and Studio plans include downloadable invoices and billing history.",
  },
];

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
          ? "border-primary bg-gradient-to-b from-primary/5 to-white shadow-lg"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
          <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
        </div>
        {plan.highlight && (
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
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
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
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
              <a
                href="/register"
                className="rounded-lg bg-secondary px-6 py-3 font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-secondary/90"
              >
                Start free
              </a>
              <a
                href="/contact"
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-100"
              >
                Contact sales
              </a>
            </div>
          </motion.div>
        </MainContainer>
      </section>

      <section className="py-12">
        <MainContainer className="px-6">
          <div className="mx-auto max-w-3xl">
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

      <section className="py-14 sm:py-20">
        <MainContainer className="px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What&apos;s included
            </h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              Everything you need to run delivery from planning to shipped.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {includedFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                </motion.article>
              );
            })}
          </div>
        </MainContainer>
      </section>

      <section className="py-14">
        <MainContainer className="px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
              {faqs.map((faq) => (
                <details key={faq.question} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-gray-900">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </MainContainer>
      </section>

      <section className="py-8">
        <MainContainer className="px-6">
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-primary/10 via-white to-secondary/10 p-8 sm:p-10">
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
                <a
                  href="/register"
                  className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary/90"
                >
                  Start free
                </a>
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
