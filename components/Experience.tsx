"use client";

import { useEffect, useRef, useState } from "react";
import Loader from "@/components/ui/Loader";
import Navigation from "@/components/ui/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import GrainOverlay from "@/components/ui/GrainOverlay";
import SoundToggle from "@/components/ui/SoundToggle";
import ScrollContent from "@/components/sections/ScrollContent";
import ScrollVideoHero from "@/components/video/ScrollVideoHero";
import ChatWidget from "@/components/chat/ChatWidget";
import CallModal from "@/components/call/CallModal";
import { useScrollDriver } from "@/lib/useScrollDriver";
import { subscribeScroll, setPointer } from "@/lib/scrollStore";
import { onOpenCallModal } from "@/lib/callModalBus";

const FADE_START = 0.94;

export default function Experience() {
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [callOpen, setCallOpen] = useState(false);
  const journeyRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useScrollDriver(journeyRef, loaded);

  // Fake-but-honest progress: ticks up on its own so the loader always
  // reads as alive, then the video's own "can play" signal (passed up via
  // onCanPlay) is what actually unlocks the site.
  useEffect(() => {
    if (loaded) return;
    const id = setInterval(() => {
      setLoadProgress((p) => (p < 92 ? p + (92 - p) * 0.08 : p));
    }, 120);
    return () => clearInterval(id);
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    return subscribeScroll((s) => {
      const wrap = canvasWrapRef.current;
      if (!wrap) return;
      const fade = 1 - Math.min(1, Math.max(0, (s.progress - FADE_START) / (1 - FADE_START)));
      wrap.style.opacity = String(fade);
      wrap.style.visibility = fade < 0.01 ? "hidden" : "visible";
    });
  }, [loaded]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setPointer(x, -y);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => onOpenCallModal(() => setCallOpen(true)), []);

  return (
    <>
      {!loaded && (
        <Loader progress={loadProgress} onDone={() => setLoaded(true)} />
      )}

      <div ref={canvasWrapRef} className="fixed inset-0 z-0" style={{ opacity: 1 }} aria-hidden>
        <ScrollVideoHero ready={loaded} onCanPlay={() => setLoadProgress(100)} />
      </div>

      <div className={loaded ? "relative z-10" : "pointer-events-none relative z-10 opacity-0"}>
        <Navigation />
        <ProgressIndicator />
        <ScrollContent journeyRef={journeyRef} />
      </div>

      {loaded && (
        <div className="fixed bottom-6 left-6 z-50 sm:bottom-8 sm:left-8">
          <SoundToggle />
        </div>
      )}

      <GrainOverlay />
      <CustomCursor />
      {loaded && <ChatWidget />}
      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}
