import Logo from "@/components/Shared/Logo/Logo";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Logo showText={true} textSize="4xl" size={50} className="-ml-1 -mt-2" />
              
            </Link>

            <p className="text-slate-400 leading-relaxed mb-6">
              Zyplo is a powerful project management platform built to help
              teams plan smarter, collaborate better, and deliver faster.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-primary transition duration-300"
              >
                <FaFacebookF size={14} />
              </Link>

              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-primary transition duration-300"
              >
                <FaXTwitter size={14} />
              </Link>

              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-primary transition duration-300"
              >
                <FaLinkedinIn size={14} />
              </Link>

              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-primary transition duration-300"
              >
                <FaGithub size={14} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources & Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/guide" className="hover:text-primary transition">
                  User Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/help"
                  className="hover:text-primary transition"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/developers"
                  className="hover:text-primary transition"
                >
                  Developers
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/customer-stories"
                  className="hover:text-primary transition"
                >
                  Customer Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/webinars"
                  className="hover:text-primary transition"
                >
                  Webinars
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/remote-work"
                  className="hover:text-primary transition"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-slate-400 mb-4">
              Get product updates and productivity tips directly in your inbox.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-l-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-sky-500"
              />
              <button
                className="px-4 rounded-r-lg text-sm font-semibold text-white
                bg-linear-to-br from-primary to-secondary
                shadow-lg shadow-indigo-500/20
                transition-all duration-300
                hover:scale-[1.02] hover:shadow-indigo-500/40
                active:scale-95"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-16 pt-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Zyplo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
