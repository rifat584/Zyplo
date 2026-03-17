export default function Features() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Our Features</h1>
        <p className="text-lg text-muted-foreground">
          Explore the amazing features that make our product unique.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-12 mb-16">

        {/* Feature Card 1 */}
        <div className="p-6 bg-card rounded-lg shadow hover:shadow-lg transition text-center">
          <div className="text-primary mb-4 text-5xl">🚀</div>
          <h3 className="text-xl font-bold mb-2">Fast Performance</h3>
          <p className="text-muted-foreground">
            Our application is optimized for speed and efficiency, giving you a seamless experience.
          </p>
        </div>

        {/* Feature Card 2 */}
        <div className="p-6 bg-card rounded-lg shadow hover:shadow-lg transition text-center">
          <div className="text-success mb-4 text-5xl">🔒</div>
          <h3 className="text-xl font-bold mb-2">Secure</h3>
          <p className="text-muted-foreground">
            Security is our top priority. Your data is always safe with end-to-end encryption.
          </p>
        </div>

        {/* Feature Card 3 */}
        <div className="p-6 bg-card rounded-lg shadow hover:shadow-lg transition text-center">
          <div className="text-info mb-4 text-5xl">⚙️</div>
          <h3 className="text-xl font-bold mb-2">Customizable</h3>
          <p className="text-muted-foreground">
            Fully customizable features to adapt to your workflow and needs.
          </p>
        </div>

        {/* Add more features easily */}
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to explore more?</h2>
        <p className="text-muted-foreground mb-6">
          Sign up today and take advantage of all these amazing features.
        </p>
        <button className="bg-linear-to-br from-primary to-secondary px-6 py-3 rounded hover:bg-primary/90 transition">
          Get Started
        </button>
      </section>

    </div>
  );
}