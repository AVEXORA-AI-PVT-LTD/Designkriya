"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Loader({ progress, onDone }: { progress: number; onDone: () => void }) {
  const [display, setDisplay] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counter = useRef({ value: 0 });
  const startedExit = useRef(false);
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    gsap.to(counter.current, {
      value: Math.max(progress, 6),
      duration: 0.6,
      ease: "power1.out",
      onUpdate: () => setDisplay(Math.round(counter.current.value)),
    });
  }, [progress]);

  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, { scaleX: display / 100, duration: 0.4, ease: "power1.out" });
    }
  }, [display]);

  useEffect(() => {
    const minTime = 1600;
    const elapsed = Date.now() - mountedAt.current;
    if (progress >= 100 && !startedExit.current) {
      startedExit.current = true;
      const wait = Math.max(0, minTime - elapsed);
      const t = setTimeout(() => {
        gsap.to(counter.current, {
          value: 100,
          duration: 0.3,
          onUpdate: () => setDisplay(Math.round(counter.current.value)),
          onComplete: () => {
            setLeaving(true);
            gsap.to(rootRef.current, {
              yPercent: -100,
              duration: 1.0,
              delay: 0.35,
              ease: "power4.inOut",
              onComplete: onDone,
            });
          },
        });
      }, wait);
      return () => clearTimeout(t);
    }
  }, [progress, onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-50"
      style={{ pointerEvents: leaving ? "none" : "auto" }}
    >
      <div className="flex flex-col items-center gap-6">
        <span className="font-body text-[11px] uppercase tracking-widest2 text-stone-500">
          Loading Space
        </span>
        <span className="font-display text-[15vw] leading-none tabular-nums text-stone-900 sm:text-[7vw]">
          {display}%
        </span>
        <div className="h-px w-[220px] overflow-hidden bg-stone-300">
          <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-stone-800" />
        </div>
      </div>
      <span className="absolute bottom-8 font-body text-[11px] tracking-widest2 text-stone-400">
        Interior Studio
      </span>
    </div>
  );
}
