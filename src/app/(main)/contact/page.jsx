export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          We’d love to hear from you! Fill out the form below or reach out via email or phone.
        </p>
      </section>

      {/* Contact Form + Info */}
      <section className="grid md:grid-cols-2 gap-12">

        {/* Form */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Email"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea
                id="message"
                rows="5"
                className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              className="bg-linear-to-br from-indigo-500 to-cyan-400 px-6 py-3 rounded hover:bg-blue-900 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-gray-600 dark:text-gray-300">contact@company.com</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <p className="text-gray-600 dark:text-gray-300">+880 1234 567 890</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Address</h3>
            <p className="text-gray-600 dark:text-gray-300">
              123 Main Street, Kaliganj, Bangladesh
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-semibold mb-6 text-center">Our Location</h2>
        <div className="w-full h-80 rounded overflow-hidden shadow">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.000000!2d90.000000!3d23.000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA5MMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

    </div>
  );
}