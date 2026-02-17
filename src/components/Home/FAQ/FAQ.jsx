"use client";
import { useState } from "react";

const faqs = [
  {
    question: "What is Zyplo?",
    answer:
      "Zyplo is a modern project management tool that helps teams plan tasks, track progress, and collaborate in real-time."
  },
  {
    question: "Who can use Zyplo?",
    answer:
      "Startups, agencies, remote teams, and enterprises can use Zyplo to manage projects efficiently."
  },
  {
    question: "Does Zyplo offer collaboration features?",
    answer:
      "Yes. You can assign tasks, set deadlines, track progress, comment on tasks, and manage team roles."
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes, Zyplo offers a free plan with essential features. Paid plans unlock advanced analytics and integrations."
  },
  {
    question: "How secure is Zyplo?",
    answer:
      "Zyplo uses secure cloud infrastructure and encrypted connections to keep your data protected."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Have questions? We’ve got answers.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition"
              onClick={() => toggle(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-900">
                  {faq.question}
                </h3>
                <span className="text-xl font-bold text-sky-500">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              {openIndex === index && (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
