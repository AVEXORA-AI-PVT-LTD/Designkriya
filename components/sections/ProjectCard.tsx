"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export type Project = {
  name: string;
  location: string;
  year: string;
  category: string;
  /** static thumbnail — either a local /images path or a picsum seed */
  image?: string;
  seed?: string;
  /** local /videos path for a looping autoplay preview instead of a still */
  video?: string;
  /** poster frame shown before the video loads/plays */
  poster?: string;
};

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement | HTMLVideoElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const visual = visualRef.current;
    if (!wrap || !visual) return;

    gsap.set(wrap, { clipPath: "inset(0 0 100% 0)" });
    gsap.set(visual, { scale: 1.22, yPercent: -6 });

    const reveal = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    });
    reveal.to(wrap, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power4.out" });
    reveal.to(visual, { scale: 1.05, duration: 1.3, ease: "power3.out" }, "-=0.9");

    const parallax = gsap.to(visual, {
      yPercent: 6,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      reveal.scrollTrigger?.kill();
      reveal.kill();
      parallax.scrollTrigger?.kill();
      parallax.kill();
    };
  }, []);

  useEffect(() => {
    const video = project.video ? (visualRef.current as HTMLVideoElement | null) : null;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [project.video]);

  return (
    <div
      data-cursor="VIEW"
      className="group cursor-none border-b border-stone-300/70 py-10 first:pt-0 md:py-14"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-8">
        <div className="md:col-span-7">
          <div ref={wrapRef} className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200">
            {project.video ? (
              <video
                ref={visualRef as React.RefObject<HTMLVideoElement>}
                className="absolute inset-0 h-full w-full object-cover"
                src={project.video}
                poster={project.poster}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <div
                ref={visualRef as React.RefObject<HTMLDivElement>}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    project.image ?? `https://picsum.photos/seed/${project.seed}/1400/1050`
                  })`,
                }}
              />
            )}
          </div>
        </div>
        <div className="md:col-span-5">
          <span className="font-body text-[11px] tabular-nums tracking-widest2 text-stone-400">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 font-display text-3xl leading-tight text-stone-900 sm:text-4xl">
            {project.name}
          </h3>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-body text-[13px] text-stone-500">
            <span>{project.location}</span>
            <span>{project.year}</span>
            <span>{project.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
