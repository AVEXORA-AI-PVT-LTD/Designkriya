// Mapped by hand from the actual PAREKH_WHATSAPP.mp4 footage (trimmed to
// 202.5s to drop the trailing black frames). Each entry's `start` is where
// that room begins in the source video. Section scroll-heights in
// ScrollContent.tsx are sized proportionally to these durations so that
// whatever room is named on screen is (roughly) the room the video is
// actually showing at that scroll position.

export const VIDEO_DURATION = 202.5;

export const VIDEO_ROOMS = [
  { key: "entry", label: "Entry", start: 0, end: 16 },
  { key: "living", label: "Living Room", start: 16, end: 32 },
  { key: "prayer", label: "Prayer Room", start: 32, end: 48 },
  { key: "kitchen", label: "Kitchen", start: 48, end: 64 },
  { key: "bedroom", label: "Bedroom", start: 64, end: 96 },
  { key: "kids", label: "Kids' Room", start: 96, end: 112 },
  { key: "bathroom", label: "Bathroom", start: 112, end: 128 },
  { key: "theatre", label: "Home Theatre", start: 128, end: 136 },
  { key: "suite", label: "Guest Suite", start: 136, end: 184 },
  { key: "dining", label: "Dining", start: 184, end: 202.5 },
] as const;

export function roomAtProgress(progress: number) {
  const t = progress * VIDEO_DURATION;
  let current: (typeof VIDEO_ROOMS)[number] = VIDEO_ROOMS[0];
  for (const room of VIDEO_ROOMS) {
    if (t >= room.start) current = room;
  }
  return current;
}

// vh assigned to each room section, proportional to its real duration.
// A hero minimum keeps the first viewport from being too short to read.
const VH_PER_SECOND = 4.9;
const HERO_MIN_VH = 100;

export function roomVh(key: (typeof VIDEO_ROOMS)[number]["key"]) {
  const room = VIDEO_ROOMS.find((r) => r.key === key)!;
  const duration = room.end - room.start;
  const vh = duration * VH_PER_SECOND;
  return key === "entry" ? Math.max(HERO_MIN_VH, vh) : vh;
}
