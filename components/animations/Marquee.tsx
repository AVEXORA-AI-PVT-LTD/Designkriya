"use client";

export default function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-[6vw] leading-none text-stone-300 sm:text-[3vw]">
              {item}
            </span>
            <span className="h-2 w-2 rounded-full bg-stone-300" aria-hidden />
          </span>
        ))}
      </div>
      <style jsx>{`
        .marquee-track {
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
