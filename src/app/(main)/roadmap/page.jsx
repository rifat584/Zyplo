export default function Roadmap() {
  const roadmapItems = [
    { quarter: "Q1 2026", title: "Product Launch", description: "Launch MVP and initial features for early adopters." },
    { quarter: "Q2 2026", title: "Feature Expansion", description: "Add advanced features based on user feedback." },
    { quarter: "Q3 2026", title: "Mobile App Release", description: "Release iOS and Android apps for all users." },
    { quarter: "Q4 2026", title: "Global Expansion", description: "Scale infrastructure and enter new markets." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Our Roadmap</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Check out our upcoming milestones and the path we are taking.
        </p>
      </section>

      {/* Roadmap Timeline */}
      <section className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 pl-6">
        {roadmapItems.map((item, index) => (
          <div key={index} className="mb-12 relative">
            {/* Dot */}
            <span className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold">
              {index + 1}
            </span>

            {/* Content */}
            <div className="ml-8">
              <h3 className="text-xl font-semibold">{item.quarter} - {item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center mt-16">
        <h2 className="text-3xl font-semibold mb-4">Want to join us on this journey?</h2>
        <button className="bg-linear-to-br from-indigo-500 to-cyan-400 px-6 py-3 rounded hover:bg-blue-900 transition">
          Join Our Team
        </button>
      </section>

    </div>
  );
}