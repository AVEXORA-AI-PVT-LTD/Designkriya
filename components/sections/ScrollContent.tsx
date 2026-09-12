"use client";

import { RefObject } from "react";
import dynamic from "next/dynamic";
import TextReveal from "@/components/animations/TextReveal";
import Magnetic from "@/components/animations/Magnetic";
import StatCounter from "@/components/animations/StatCounter";
import Marquee from "@/components/animations/Marquee";
import TeamStrip from "./TeamStrip";
import ProjectCard, { Project } from "./ProjectCard";
import { VIDEO_ROOMS, roomVh } from "@/lib/videoTimeline";
import { openCallModal } from "@/lib/callModalBus";

const StudioMap = dynamic(() => import("@/components/map/StudioMap"), { ssr: false });

// NOTE: location/year are placeholders — swap in the real details for each
// project. category is read directly from the footage (residential vs.
// commercial fit-out). Parekh already stars as the site's video hero, so its
// project card uses a still frame rather than repeating the same clip;
// Johnson gets the looping video treatment since it doesn't appear elsewhere.
const PROJECTS: Project[] = [
  {
    name: "Parekh Residence",
    location: "India",
    year: "2024",
    category: "Residential",
    image: "/images/parekh-project-thumb.jpg",
  },
  {
    name: "Johnson Fitness \u2014 Onyx by Matrix",
    location: "India",
    year: "2024",
    category: "Retail / Commercial Fit-out",
    video: "/videos/johnson-office-loop.mp4",
    poster: "/images/johnson-loop-poster.jpg",
  },
];

// Placeholder figures — swap for your studio's real numbers.
const STATS = [
  { value: 120, suffix: "+", label: "Projects delivered" },
  { value: 12, suffix: "", label: "Years in practice" },
  { value: 3, suffix: "", label: "Cities" },
  { value: 40, suffix: "+", label: "Happy clients" },
];

const MARQUEE_ITEMS = [
  "LIVING",
  "PRAYER ROOM",
  "KITCHEN",
  "BEDROOM",
  "KIDS\u2019 ROOM",
  "BATHROOM",
  "HOME THEATRE",
  "GUEST SUITE",
  "DINING",
];

type RoomCopy = { heading: string; body: string };

const ROOM_COPY: Record<string, RoomCopy> = {
  entry: {
    heading: "One house,\nwalked through.",
    body: "Every room ahead is real footage from a home we designed \u2014 keep scrolling to move through it end to end.",
  },
  living: {
    heading: "LIVING ROOM",
    body: "A round mirror anchors the seating group \u2014 the one spot in the house built purely for gathering.",
  },
  prayer: {
    heading: "PRAYER ROOM",
    body: "Hand-carved white marble, set apart from the rest of the plan but never far from it.",
  },
  kitchen: {
    heading: "KITCHEN",
    body: "Matte cabinetry and a single run of counter \u2014 built for a house that actually cooks.",
  },
  bedroom: {
    heading: "BEDROOM",
    body: "Upholstered headboards, low lighting, curtains heavy enough to hold the morning back.",
  },
  kids: {
    heading: "KIDS\u2019 ROOM",
    body: "A climbing wall on one side, a painted night sky on the other. Built to be outgrown slowly.",
  },
  bathroom: {
    heading: "BATHROOM",
    body: "Onyx and dark marble, lit low \u2014 the quietest room in the house by design.",
  },
  theatre: {
    heading: "HOME THEATRE",
    body: "Backlit steps and a floor that glows underfoot. The one room built entirely for the dark.",
  },
  suite: {
    heading: "GUEST SUITE",
    body: "Its own sitting area, its own light \u2014 a house within the house for whoever's staying.",
  },
  dining: {
    heading: "DINING",
    body: "The tour ends where most evenings do \u2014 at a table, under a chandelier built for exactly this room.",
  },
};

export default function ScrollContent({
  journeyRef,
}: {
  journeyRef: RefObject<HTMLDivElement>;
}) {
  return (
    <div id="top" className="relative">
      {/* ---------------------------------------------------------------- */}
      {/* Camera journey: this element's height IS the scroll distance the */}
      {/* real walkthrough video (ScrollVideoHero) is scrubbed against.    */}
      {/* Section heights come from lib/videoTimeline.ts, proportional to  */}
      {/* how long the camera actually spends in each room on the source  */}
      {/* footage, so the heading on screen matches what's playing.        */}
      {/* ---------------------------------------------------------------- */}
      <div ref={journeyRef}>
        {VIDEO_ROOMS.map((room, i) => {
          const copy = ROOM_COPY[room.key];
          const isEntry = room.key === "entry";
          const alignRight = !isEntry && i % 2 === 1;

          return (
            <section
              key={room.key}
              id={room.key}
              style={{ height: `${roomVh(room.key)}vh` }}
              className={
                isEntry
                  ? "relative flex items-end px-6 pb-20 sm:px-10 sm:pb-24"
                  : `relative flex items-center px-6 sm:px-10 ${
                      alignRight ? "justify-end" : ""
                    }`
              }
            >
              <div
                className={`max-w-md ${alignRight ? "text-right" : ""}`}
                style={{ textShadow: "0 2px 28px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.65)" }}
              >
                {!isEntry && (
                  <span className="font-body text-[11px] uppercase tracking-widest2 text-white/80">
                    {String(i + 1).padStart(2, "0")} / {String(VIDEO_ROOMS.length).padStart(2, "0")}
                  </span>
                )}
                {isEntry && (
                  <span className="font-body text-[11px] uppercase tracking-widest2 text-white/70">
                    A real walkthrough
                  </span>
                )}
                <TextReveal
                  as="h2"
                  className={
                    isEntry
                      ? "mt-4 whitespace-pre-line font-display text-[10vw] leading-[0.95] text-white sm:text-[6vw]"
                      : "mt-4 font-display text-[13vw] leading-[0.9] text-white sm:text-[6.5vw]"
                  }
                >
                  {copy.heading}
                </TextReveal>
                <p
                  className={`mt-6 max-w-sm font-body text-[15px] leading-relaxed text-white/80 ${
                    alignRight ? "ml-auto" : ""
                  }`}
                >
                  {copy.body}
                </p>
                {isEntry && (
                  <Magnetic className="mt-8">
                    <button
                      onClick={openCallModal}
                      data-cursor="TALK"
                      className="cursor-none rounded-full bg-white px-6 py-3 font-body text-[12px] uppercase tracking-widest2 text-stone-900 transition-transform hover:scale-[1.03]"
                    >
                      Book a call
                    </button>
                  </Magnetic>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Below the journey: the video hero has faded out and ordinary */}
      {/* document flow / scroll takes over.                           */}
      {/* ------------------------------------------------------------ */}
      <div className="relative bg-stone-50 py-10">
        <Marquee items={MARQUEE_ITEMS} />
      </div>

      <section id="projects-section" className="relative bg-stone-50 px-6 pb-32 pt-16 sm:px-10">
        <div className="mb-16 flex flex-col gap-6 sm:mb-24 sm:flex-row sm:items-end sm:justify-between">
          <TextReveal as="h2" className="font-display text-[11vw] leading-[0.9] text-stone-900 sm:text-[5vw]">
            Recent projects
          </TextReveal>
          <p className="max-w-xs font-body text-[14px] leading-relaxed text-stone-500">
            A small studio, a short list of spaces we&rsquo;ve spent real time
            in.
          </p>
        </div>
        <div>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </section>

      <section id="studio-section" className="relative bg-stone-100 px-6 py-32 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <span className="font-body text-[11px] uppercase tracking-widest2 text-stone-500">
            The studio
          </span>
          <TextReveal
            as="h2"
            className="mt-4 font-display text-[9vw] leading-[1.02] text-stone-900 sm:text-[4vw]"
          >
            We design the ordinary hours of a house, not just the photographs of it.
          </TextReveal>
          <p className="mt-8 max-w-xl font-body text-[15px] leading-relaxed text-stone-600">
            Interior Studio is a small practice working across Bengaluru,
            Mumbai and Goa. We start from how a room is actually used at 7am
            and 11pm, and let the drawings follow from there &mdash;
            furniture, material and light considered together rather than
            layered on at the end.
          </p>

          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {STATS.map((s) => (
              <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>

          <div className="mt-16 border-t border-stone-300 pt-10">
            <span className="font-body text-[11px] uppercase tracking-widest2 text-stone-500">
              The team
            </span>
            <div className="mt-6">
              <TeamStrip />
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact-section"
        className="relative flex flex-col justify-between bg-stone-900 px-6 py-16 text-stone-50 sm:px-10"
      >
        <div />
        <div>
          <TextReveal
            as="h2"
            className="font-display text-[16vw] leading-[0.88] text-stone-50 sm:text-[9vw]"
            start="top 90%"
          >
            {"LET'S CREATE."}
          </TextReveal>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="mailto:studio@interiorstudio.in"
              data-cursor="WRITE"
              className="cursor-none inline-flex items-center gap-3 border-b border-stone-500 pb-1 font-body text-[13px] uppercase tracking-widest2 text-stone-200 transition-colors hover:border-stone-50 hover:text-stone-50"
            >
              studio@interiorstudio.in
            </a>
            <Magnetic>
              <button
                onClick={openCallModal}
                data-cursor="TALK"
                className="cursor-none rounded-full border border-stone-500 px-5 py-2.5 font-body text-[12px] uppercase tracking-widest2 text-stone-100 transition-colors hover:border-stone-50"
              >
                Book a call instead
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="mt-16">
          <span className="font-body text-[11px] uppercase tracking-widest2 text-stone-500">
            Where we work
          </span>
          <div className="mt-4">
            <StudioMap />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 pb-4 font-body text-[12px] uppercase tracking-widest2 text-stone-500 sm:flex-row sm:items-end sm:justify-between">
          <span>Bengaluru &middot; Mumbai &middot; Goa</span>
          <span>&copy; {new Date().getFullYear()} Interior Studio</span>
        </div>
      </section>
    </div>
  );
}
