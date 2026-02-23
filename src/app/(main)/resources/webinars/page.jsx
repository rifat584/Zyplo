export default function WebinarsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 min-h-[60vh]">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-heading font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Zyplo Webinars
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Join our live sessions to learn advanced workflow techniques, productivity hacks, and deep dives into new Zyplo features.
        </p>
      </div>
      
      {/* Placeholder for future video grid */}
      <div className="mt-10 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400">
        Upcoming webinars will be listed here.
      </div>
    </div>
  );
}