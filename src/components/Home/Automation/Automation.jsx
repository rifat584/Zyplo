export default function Automation() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Workflow Automation
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Save time and reduce manual work with Zyplo’s powerful automation.
            Automate tasks, notifications, and project updates effortlessly.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-md transition">
            <div className="text-sky-500 text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Task Auto-Assignment
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically assign tasks to team members based on roles,
              workload, or project rules.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-md transition">
            <div className="text-sky-500 text-3xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Smart Notifications
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant updates when deadlines approach, tasks change,
              or milestones are completed.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-md transition">
            <div className="text-sky-500 text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Automated Reports
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Generate performance reports and project summaries
              automatically with real-time data.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg font-medium transition">
            Explore Automation
          </button>
        </div>

      </div>
    </section>
  );
}
