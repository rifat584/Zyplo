import Image from "next/image";
import Link from "next/link";

export default function Logo({
    href = "/",
    size = 32,
    showText = true,
    className = "",
}) {
    return (
        <Link href={href} className={`flex items-center ${className}`}>
            <Image
                src="/logo.png"
                alt="Zyplo Logo"
                width={size}
                height={size}
                priority
                className="rounded-full"
            />
            {showText && (
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100 -ml-2 font-serif">
                    Zypl<span className="text-transparent bg-clip-text bg-size-[200%_200%] bg-linear-to-r from-indigo-400 via-cyan-300 to-fuchsia-400 animate-gradient">
                        o
                    </span>
                </span>
            )}
        </Link>
    );
}