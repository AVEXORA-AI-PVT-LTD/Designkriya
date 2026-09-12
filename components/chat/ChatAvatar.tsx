"use client";

export default function ChatAvatar({ size = 40, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        className="rounded-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="mayaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4e4941" />
            <stop offset="100%" stopColor="#8a7d6b" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="24" fill="url(#mayaGrad)" />
        {/* Abstract "M" mark built from simple geometry, echoing the site's
            architectural/editorial mark rather than a stock avatar photo. */}
        <path
          d="M14 32V17l10 10 10-10v15"
          fill="none"
          stroke="#f6f4f1"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {pulse && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-stone-50 bg-emerald-500" />
        </span>
      )}
    </div>
  );
}
