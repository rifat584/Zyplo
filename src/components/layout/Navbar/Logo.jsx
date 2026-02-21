import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <>
      <Link href="/" className="flex items-center gap-2">
        <div className="group flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-cyan-400 text-white font-bold text-lg transition-transform duration-500 hover:rotate-10 hover:scale-110 shadow-lg shadow-indigo-500/30">
          Z
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Zyplo
        </span>
      </Link>
    </>
  );
};

export default Logo;
