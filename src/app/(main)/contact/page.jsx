import { Clock3, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <section className="relative mb-16 overflow-hidden rounded-[2.25rem] border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(248,250,252,0.72))] px-6 py-8 shadow-[0_28px_90px_-42px_rgba(15,23,42,0.4)] sm:px-10 sm:py-10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.76))]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.22),transparent_24%),radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.18),transparent_26%),linear-gradient(to_bottom,transparent,rgba(15,23,42,0.04))]" />
        <div className="pointer-events-none absolute left-6 top-6 h-24 w-24 rounded-full border border-secondary/20" />
        <div className="pointer-events-none absolute bottom-8 right-8 h-32 w-32 rounded-full bg-secondary/12 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-[1.8rem] border border-border/60 bg-background/72 p-6 backdrop-blur-sm sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-secondary">
                Contact Desk
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[4.35rem] lg:leading-[0.96]">
                Tell us where
                <span className="block bg-linear-to-r from-foreground via-secondary to-primary bg-clip-text text-transparent">
                  your team needs help.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                From product questions to onboarding support, this is the
                fastest way to reach the people behind Zyplo.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-border/70 bg-black/30 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                  Email First
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Best for detailed requests and product discussions.
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-border/70 bg-black/30 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                  Fast Replies
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Clear next steps, usually within one business day.
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-border/70 bg-black/30 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                  Real Support
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Practical help for teams, setup, and workflow questions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.8rem] border border-border/70 bg-black/25 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                At A Glance
              </p>
              <div className="mt-5 space-y-5">
                <div className="border-l-2 border-secondary/35 pl-4">
                  <p className="text-sm font-semibold text-foreground">
                    Product questions
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Features, pricing, use cases, and onboarding.
                  </p>
                </div>
                <div className="border-l-2 border-primary/30 pl-4">
                  <p className="text-sm font-semibold text-foreground">
                    Team support
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Guidance for setup, collaboration, and workflows.
                  </p>
                </div>
                <div className="border-l-2 border-secondary/35 pl-4">
                  <p className="text-sm font-semibold text-foreground">
                    Partnership chats
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Reach out if you want to build or collaborate with Zyplo.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-border/70 bg-black/20 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                Availability
              </p>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                Mon to Sat
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Reach out anytime. We review messages carefully and respond with
                focused, useful guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] lg:gap-10">
        {/* Form */}
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-[0_22px_70px_-34px_rgba(15,23,42,0.42)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32" />

          <div className="relative">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
                Start The Conversation
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                Tell us what you need
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Use the form below to outline your goals, ask a question, or
                share what your team is working on.
              </p>
            </div>

            <form className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3.5 text-sm text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/25"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3.5 text-sm text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/25"
                    placeholder="Your Email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full rounded-[1.5rem] border border-border bg-background/80 px-4 py-3.5 text-sm text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/25"
                  placeholder="Write your message..."
                />
              </div>

              <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/70 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">
                  Reach us directly
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Prefer a faster path? Use the contact details on the right and
                  our team will guide you from there.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          {/* <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[0_18px_54px_-36px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              Contact Info
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              Connect with the Zyplo team
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Choose the channel that works best for your question and we will
              take it from there.
            </p>
          </div> */}

          <div className="rounded-[1.75rem] border border-border/70 p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/12 text-secondary">
                <Mail size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Email</h3>
                <p className="mt-2 text-base text-foreground">
                  contact@company.com
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Best for product questions, onboarding help, and partnership
                  conversations.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Phone size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Phone</h3>
                <p className="mt-2 text-base text-foreground">
                  +880 1234 567 890
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Reach out for direct coordination and quick follow-up
                  conversations.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/12 text-secondary">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Address
                </h3>
                <p className="mt-2 text-base text-foreground">
                  123 Main Street, Kaliganj, Bangladesh
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A central point for meetings, support, and project
                  collaboration.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 via-card to-card p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-foreground">
                <Clock3 size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Response Time
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We usually respond within one business day with practical,
                  focused next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Our Location
        </h2>
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
