import Logo from "@/components/Shared/Logo/Logo";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const resourceLinks = [
  { href: "/resources/guide", label: "User Guide" },
  { href: "/resources/help", label: "Help Center" },
  { href: "/resources/developers", label: "Developers" },
  { href: "/resources/customer-stories", label: "Customer Stories" },
  { href: "/resources/webinars", label: "Webinars" },
  { href: "/resources/remote-work", label: "Remote Work" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://x.com", label: "X", icon: FaXTwitter },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedinIn },
  { href: "https://github.com", label: "GitHub", icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-card/80 pt-[4.5rem] pb-20 text-card-foreground backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-secondary/8 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.15fr_0.7fr_0.95fr_1.1fr]">
          {/* Brand */}
          <div className="relative">
            <Link href="/" className="mb-4 inline-flex items-center">
              <Logo showText textSize="3xl" size={44} className="-ml-1" />
            </Link>

            <p className="marketing-copy mb-6 max-w-sm leading-relaxed">
              Zyplo is a powerful project management platform built to help
              teams plan smarter, collaborate better, and deliver faster.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-border/80 bg-background/80 p-3 text-muted-foreground shadow-sm transition-colors hover:border-primary/25 hover:bg-card hover:text-primary"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="marketing-subtle mb-4 text-sm font-semibold uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="marketing-subtle mb-4 text-sm font-semibold uppercase tracking-wide">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="rounded-3xl border border-border/80 bg-background/75 p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)]">
            <h4 className="marketing-subtle mb-3 text-sm font-semibold uppercase tracking-wide">
              Stay Updated
            </h4>
            <p className="marketing-copy mb-3 max-w-sm text-sm leading-6">
              Get product updates and productivity tips directly in your inbox.
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="button"
                variant="marketing"
                size="sm"
                className="h-11 w-full px-5"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="marketing-subtle mt-14 border-t border-border/80 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Zyplo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
