export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-16 px-6 transition-colors duration-300">
      
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">About Zyplo</h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-12">
          Zyplo is a cutting-edge project management platform designed to help teams plan smarter, collaborate efficiently, and deliver exceptional results faster. 
          We combine simplicity, speed, and intelligence to provide a seamless experience for project teams of all sizes.
        </p>
      </div>

      {/* Mission, Vision, Values Section */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
        {/* Mission */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-md dark:shadow-gray-800 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300">
            To empower teams with tools that simplify project management, foster collaboration, and drive productivity in every project.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-md dark:shadow-gray-800 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Vision</h2>
          <p className="text-gray-600 dark:text-gray-300">
            To become the world’s most intuitive and efficient project management platform, trusted by teams globally for seamless project delivery.
          </p>
        </div>

        {/* Values */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-md dark:shadow-gray-800 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Values</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Innovation, transparency, collaboration, and excellence guide everything we do, helping teams achieve their goals efficiently.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-5xl mx-auto mt-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Meet the Team</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-12">
          Zyplo is built by a passionate team of designers, developers, and project managers who are dedicated to improving how teams work together.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-gray-800 p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Arif</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">CEO & Founder</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-gray-800 p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lipi</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Product Manager</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-gray-800 p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sami</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Lead Developer</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-gray-800 p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Nadia</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">UI/UX Designer</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-3xl mx-auto mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to get started?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Join thousands of teams using Zyplo to manage projects effectively and achieve better results.
        </p>
       <a
  href="/signup"
  className="inline-block px-8 py-3 text-white font-semibold rounded-lg 
             bg-gradient-to-br from-indigo-500 to-cyan-400 
             shadow-lg shadow-indigo-500/20 
             transition-all duration-300 
             hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95"
>
  Get Started
</a>
      </div>

    </div>
  );
}