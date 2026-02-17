import React from "react";
import MainContainer from "../container/MainContainer";

const PricingCtaBanner = () => {
  return (
      <MainContainer className="px-6">
        <div className="rounded-2xl border border-gray-200 bg-linear-to-r from-primary/10 via-white to-secondary/10 p-8 sm:p-10">
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
  );
};

export default PricingCtaBanner;
