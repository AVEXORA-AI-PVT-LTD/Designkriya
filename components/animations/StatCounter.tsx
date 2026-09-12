"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => setDisplay(Math.round(counter.value)),
      paused: true,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);

  return (
    <div ref={ref}>
      <div className="font-display text-[13vw] leading-none text-stone-900 sm:text-[4vw]">
        {display}
        {suffix}
      </div>
      <div className="mt-2 font-body text-[12px] uppercase tracking-widest2 text-stone-500">
        {label}
      </div>
    </div>
  );
}
