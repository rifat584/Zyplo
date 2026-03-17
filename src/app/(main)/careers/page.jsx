export default function Careers() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
        <p className="text-lg text-muted-foreground">
          We're always looking for talented individuals to grow with us.
        </p>
      </section>

      {/* Open Positions */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Open Positions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Job Card */}
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Frontend Developer</h3>
            <p className="text-muted-foreground mb-4">
              Work on exciting web projects using React, Next.js, and Tailwind CSS.
            </p>
            <p className="text-sm text-muted-foreground mb-4">Location: Remote / Hybrid</p>
            <button className="bg-linear-to-br from-primary to-secondary px-4 py-2 rounded hover:bg-primary/90 transition">
              Apply Now
            </button>
          </div>

          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Backend Developer</h3>
            <p className="text-muted-foreground mb-4">
              Build scalable backend systems and APIs using Node.js and MongoDB.
            </p>
            <p className="text-sm text-muted-foreground mb-4">Location: Remote / Hybrid</p>
            <button className="bg-linear-to-br from-primary to-secondary px-4 py-2 rounded hover:bg-primary/90 transition">
              Apply Now
            </button>
          </div>

          {/* More positions add easily */}
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="mb-16 text-center">
        <h2 className="text-3xl font-semibold mb-6">Why Work With Us?</h2>
        <p className="text-muted-foreground mb-4">
          We value creativity, teamwork, and personal growth. Join a team that challenges and supports you.
        </p>
        <p className="text-muted-foreground">
          Competitive salary, flexible hours, and a friendly work environment.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to start your journey?</h2>
        <button className="bg-linear-to-br from-primary to-secondary px-6 py-3 rounded-lg hover:bg-primary/90 transition">
          Explore Open Positions
        </button>
      </section>

    </div>
  );
}