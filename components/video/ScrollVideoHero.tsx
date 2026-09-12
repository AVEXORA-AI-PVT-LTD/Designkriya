"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollScrub } from "@/lib/useScrollScrub";
import { VIDEO_DURATION } from "@/lib/videoTimeline";

export default function ScrollVideoHero({
  ready,
  onCanPlay,
}: {
  ready: boolean;
  onCanPlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const firedRef = useRef(false);

  useScrollScrub(videoRef, VIDEO_DURATION, ready);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Autoplay-then-immediately-pause is the reliable cross-browser way to
    // get a muted video "warmed up" (decoder ready, first frame painted)
    // before we start driving currentTime by hand.
    const onLoaded = () => {
      setLoaded(true);
      video.pause();
      if (!firedRef.current) {
        firedRef.current = true;
        onCanPlay();
      }
    };
    video.addEventListener("loadeddata", onLoaded);
    video.play().catch(() => {
      /* autoplay can be blocked; loadeddata still fires once buffered */
    });
    return () => video.removeEventListener("loadeddata", onLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-stone-900">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease" }}
        src="/videos/parekh-walkthrough.mp4"
        poster="/images/parekh-poster.jpg"
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      {/* Soft scrim so overlaid typography stays legible against footage
          that runs from bright kitchens to dark theatre rooms. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
    </div>
  );
}
