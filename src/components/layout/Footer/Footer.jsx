import Logo from "@/components/Shared/Logo/Logo";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Button from "@/components/Shared/Button/Button";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/95 pt-16 pb-8 text-card-foreground">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center">
              <Logo
                showText
                textSize="3xl"
                size={44}
                className="-ml-1"
              />
            </Link>

            <p className="mb-6 leading-relaxed text-muted-foreground">
              Zyplo is a powerful project management platform built to help
              teams plan smarter, collaborate better, and deliver faster.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background p-3 text-muted-foreground transition-colors hover:border-primary/35 hover:bg-accent hover:text-primary"
              >
                <FaFacebookF size={14} />
              </Link>

              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background p-3 text-muted-foreground transition-colors hover:border-primary/35 hover:bg-accent hover:text-primary"
              >
                <FaXTwitter size={14} />
              </Link>

              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background p-3 text-muted-foreground transition-colors hover:border-primary/35 hover:bg-accent hover:text-primary"
              >
                <FaLinkedinIn size={14} />
              </Link>

              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background p-3 text-muted-foreground transition-colors hover:border-primary/35 hover:bg-accent hover:text-primary"
              >
                <FaGithub size={14} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/85">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/85">
              Resources & Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/resources/guide" className="transition-colors hover:text-primary">
                  User Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/help"
                  className="transition-colors hover:text-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/developers"
                  className="transition-colors hover:text-primary"
                >
                  Developers
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/customer-stories"
                  className="transition-colors hover:text-primary"
                >
                  Customer Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/webinars"
                  className="transition-colors hover:text-primary"
                >
                  Webinars
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/remote-work"
                  className="transition-colors hover:text-primary"
                >
                  Remote Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/85">
              Stay Updated
            </h4>
            <p className="mb-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Get product updates and productivity tips directly in your inbox.
            </p>

            <div className="flex flex-col gap-2 max-md:flex-row max-md:items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 max-md:flex-1"
              />
              <Button
                type="button"
                size="sm"
                className="h-10 w-full px-5 shadow-none hover:scale-100 hover:bg-primary/90 hover:shadow-none max-md:w-auto max-md:min-w-[8.5rem]"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Zyplo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
