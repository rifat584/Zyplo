import { Search } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 min-h-[60vh]">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-heading font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Help Center
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Need a hand? Search our documentation or contact our support team.
        </p>
      </div>

      <div className="mt-8 max-w-xl">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for articles, guides, or FAQs..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-3 pl-12 pr-4 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}