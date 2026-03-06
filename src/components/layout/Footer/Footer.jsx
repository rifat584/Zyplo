import Logo from "@/components/Shared/Logo/Logo";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { FaFacebookF, FaLinkedinIn,  FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <Link href={"/"} className="flex justify-start items-center mb-4">
              <Logo showText={false} size={65} className="-ml-1 -mt-2" />
              <span className="ml-2 font-bold font-serif text-3xl text-gray-200 -mt-1">Zyplo</span>
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
    className="bg-slate-800 p-3 rounded-full hover:bg-sky-500 transition"
  >
    <FaFacebookF size={14} />
  </Link>

  <Link
    href="https://x.com"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-slate-800 p-3 rounded-full hover:bg-sky-500 transition"
  >
  
    <FaXTwitter size={14} />
  </Link>

  <Link
    href="https://linkedin.com"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-slate-800 p-3 rounded-full hover:bg-sky-500 transition"
  >
    <FaLinkedinIn size={14} />
  </Link>

  <Link
    href="https://github.com"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-slate-800 p-3 rounded-full hover:bg-sky-500 transition"
  >
    <FaGithub size={14} />
  </Link>

</div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/features" className="hover:text-sky-400 transition">Features</Link></li>

            
              <li><Link href="/roadmap" className="hover:text-sky-400 transition">Roadmap</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-sky-400 transition">About</Link></li>
              <li><Link href="/careers" className="hover:text-sky-400 transition">Careers</Link></li>
           
              <li><Link href="/contact" className="hover:text-sky-400 transition">Contact</Link></li>
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
                className="w-full px-4 py-2 rounded-l-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none"
              />
              <button
                className="px-4 rounded-r-lg text-sm font-semibold text-white
  bg-linear-to-br from-indigo-500 to-cyan-400
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
