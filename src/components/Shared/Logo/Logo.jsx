import Image from "next/image";

export default function Logo({
    size = 32,
    textSize= "2xl",
    showText = true,
    className = "",
}) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <Image
                src="/logo1.png"
                alt="Zyplo Logo"
                width={size}
                height={size}
                priority
                className="rounded-full"
            />
            {showText && (
                <span className={`text-${textSize} font-bold text-primary`}>
                    ZYPL
                    <span className=""> 
                        O
                    </span>
{/* text-transparent bg-clip-text bg-size-[200%_200%] bg-linear-to-r from-primary/80 to-secondary animate-gradient */}
                </span>
            )}
        </div>
    );
}
