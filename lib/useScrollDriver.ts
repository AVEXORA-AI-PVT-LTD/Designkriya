"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setScrollProgress, setScrollReady } from "@/lib/scrollStore";

export function useScrollDriver(
  journeyRef: React.RefObject<HTMLElement>,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    let trigger: ScrollTrigger | undefined;
    if (journeyRef.current) {
      trigger = ScrollTrigger.create({
        trigger: journeyRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          setScrollProgress(self.progress, self.getVelocity() / 2000);
        },
      });
    }

    setScrollReady(true);
    ScrollTrigger.refresh();

    return () => {
      trigger?.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
      setScrollReady(false);
    };
  }, [enabled, journeyRef]);
}
