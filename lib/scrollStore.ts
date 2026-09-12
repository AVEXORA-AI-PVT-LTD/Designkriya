// A tiny mutable store for scroll progress.
//
// R3F's render loop (useFrame) runs outside React's commit cycle, so driving
// the camera off React state would mean re-rendering the whole component
// tree on every scroll pixel. Instead we keep a single mutable object that
// GSAP/ScrollTrigger writes to, and the 3D layer reads from inside
// useFrame. React components that need the value for UI (progress bar,
// section counter) subscribe via the listener list, which is only notified
// on meaningful change (rAF-throttled by ScrollTrigger itself).

export type ScrollState = {
  /** 0 -> top of the page, 1 -> bottom of the scrollable journey */
  progress: number;
  /** Signed scroll velocity, roughly -1..1, used for subtle motion blur/sway */
  velocity: number;
  /** True once the intro loader has finished and scroll is enabled */
  ready: boolean;
};

export const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
  ready: false,
};

type Listener = (state: ScrollState) => void;
const listeners = new Set<Listener>();

export function setScrollProgress(progress: number, velocity = 0) {
  scrollState.progress = Math.min(1, Math.max(0, progress));
  scrollState.velocity = velocity;
  listeners.forEach((l) => l(scrollState));
}

export function setScrollReady(ready: boolean) {
  scrollState.ready = ready;
  listeners.forEach((l) => l(scrollState));
}

export function subscribeScroll(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Mouse position, normalized -1..1, for restrained parallax.
export const pointerState = { x: 0, y: 0, targetX: 0, targetY: 0 };

export function setPointer(x: number, y: number) {
  pointerState.targetX = x;
  pointerState.targetY = y;
}
