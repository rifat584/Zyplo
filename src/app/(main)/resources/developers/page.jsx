export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 min-h-[60vh]">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-heading font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Developer API & Webhooks
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Build custom integrations, automate your team's unique workflows, and connect Zyplo to the rest of your tech stack.
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
          Read the API Docs
        </button>
        <button className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          Manage API Keys
        </button>
      </div>
    </div>
  );
}