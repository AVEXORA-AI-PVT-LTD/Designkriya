"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { splitChars } from "@/lib/splitText";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  children: string;
  /** delay before the stagger starts, seconds */
  delay?: number;
  /** stagger between characters, seconds */
  stagger?: number;
  start?: string;
};

export default function TextReveal({
  as = "h2",
  className = "",
  children,
  delay = 0,
  stagger = 0.022,
  start = "top 78%",
}: Props) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = splitChars(el);

    gsap.set(chars, { yPercent: 115, rotateZ: 6, opacity: 0 });

    const tween = gsap.to(chars, {
      yPercent: 0,
      rotateZ: 0,
      opacity: 1,
      duration: 1.1,
      ease: "power4.out",
      stagger: stagger,
      delay,
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      toggleActions: "play none none reverse",
      animation: tween,
    });

    return () => {
      st.kill();
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
