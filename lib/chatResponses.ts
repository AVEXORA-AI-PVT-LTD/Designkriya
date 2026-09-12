// Rule-based fallback so the chat widget is genuinely useful out of the
// box, with zero configuration. If ANTHROPIC_API_KEY is set (see
// app/api/chat/route.ts), real model responses take over automatically —
// this file stays as the offline/no-key fallback either way.

type Rule = {
  keywords: string[];
  reply: string;
};

const RULES: Rule[] = [
  {
    keywords: ["price", "cost", "budget", "fee", "charge", "quote"],
    reply:
      "Fees depend on scope \u2014 a single room versus a full house, and whether we're doing design only or design-and-build. Most residential projects with us run over 8\u201316 weeks of design + execution. Want to share your city and rough scope so I can point you to the right next step?",
  },
  {
    keywords: ["time", "timeline", "long", "duration", "when", "schedule"],
    reply:
      "A full home typically takes 3\u20136 months from first meeting to move-in, depending on size and whether structural work is involved. A single room can be much faster. What are you working with \u2014 a full house or a specific room?",
  },
  {
    keywords: ["location", "city", "where", "based", "office", "studio"],
    reply:
      "We work across Bengaluru, Mumbai and Goa \u2014 you can see both projects on this page pinned on the map further down. Are you looking to start a project in one of those cities?",
  },
  {
    keywords: ["call", "phone", "talk", "speak", "contact"],
    reply:
      "Happy to set up a call. Use the \u201cBook a call\u201d button in the corner and leave your number and a good time \u2014 or email studio@interiorstudio.in directly.",
  },
  {
    keywords: ["hi", "hello", "hey", "hii", "hiii"],
    reply:
      "Hi! I'm Maya, the studio assistant. Ask me about pricing, timelines, our process, or where we work \u2014 or tell me a bit about your project and I'll point you in the right direction.",
  },
  {
    keywords: ["process", "how", "work", "steps"],
    reply:
      "Our process is roughly: a first conversation about how you actually live \u2192 concept + material direction \u2192 detailed drawings \u2192 execution with weekly site updates. We keep clients in the loop the whole way, not just at the reveal.",
  },
  {
    keywords: ["parekh", "johnson", "project", "portfolio", "work"],
    reply:
      "The two projects on this page are real client work \u2014 the Parekh residence (the video you're scrolling through right now) and the Johnson Fitness / Onyx by Matrix retail fit-out. Want details on either?",
  },
];

const DEFAULT_REPLY =
  "Good question \u2014 I don't have a canned answer for that one, but the studio team will. Want me to open a call request, or you can email studio@interiorstudio.in directly.";

export const SUGGESTED_QUESTIONS = [
  "How much does a project like this cost?",
  "How long does a full house take?",
  "Which cities do you work in?",
];

export function cannedReply(message: string): string {
  const lower = message.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.reply;
  }
  return DEFAULT_REPLY;
}
