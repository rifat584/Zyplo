"use client";

export default function ZyploLoader({ className = "" }) {
  return (
    <div className={`flex w-full items-center justify-center p-10 ${className}`}>
      <style>{`
        .water-fill-text {
          background: linear-gradient(to top, #6366f1 50%, transparent 50%);
          background-size: 100% 200%;
          background-position: 0% 100%;
          -webkit-background-clip: text;
          color: transparent;
          animation: water-fill-anim 1.5s infinite alternate ease-in-out;
          -webkit-text-stroke: 1.5px rgba(99, 102, 241, 0.2);
        }
        
        /* Dark mode support */
        :global(.dark) .water-fill-text {
          background: linear-gradient(to top, #22d3ee 50%, transparent 50%);
          background-size: 100% 200%;
          -webkit-text-stroke: 1.5px rgba(34, 211, 238, 0.2);
        }

        @keyframes water-fill-anim {
          0% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
      <h2 className="water-fill-text text-3xl font-black tracking-[0.2em] sm:text-4xl">
        ZYPLO
      </h2>
    </div>
  );
}