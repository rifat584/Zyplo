import Link from 'next/link';
import { Search, Sun } from 'lucide-react';

const Navbar = () => {
  return (
    // STICKY HEADER CHANGES:
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      
      {/* MAX WIDTH 1280px (max-w-7xl) & CENTERED (mx-auto) */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* --- Left: Logo --- */}
        <div className="flex items-center gap-2">
          {/* Logo with your primary color #4f46e5 */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-xl">
            Z
          </div>
          <span className="text-xl font-bold text-gray-900">Zyplo</span>
        </div>

        {/* --- Center: Links --- */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#" className="hover:text-gray-900 transition-colors">Features</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Workflow</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">FAQ</Link>
        </div>

        {/* --- Right: Actions --- */}
        <div className="flex items-center gap-4">
          
          {/* Search Button */}
          <button className="hidden sm:flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all">
            <Search size={16} />
            <span className="font-medium text-gray-500">Ctrl+K</span>
          </button>

          {/* Theme Toggle */}
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <Sun size={20} />
          </button>

          {/* Sign In Link */}
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Sign in
          </Link>

          {/* Get Started Button */}
          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
            Get started
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;