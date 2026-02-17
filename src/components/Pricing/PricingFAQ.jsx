import React from "react";
import MainContainer from "../container/MainContainer";
import { ChevronDown } from "lucide-react";
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

const PricingFAQ = () => {
  return (
    <div>
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
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default PricingFAQ;
