import { NextRequest, NextResponse } from "next/server";
import { cannedReply } from "@/lib/chatResponses";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Maya, the friendly front-desk assistant for Interior Studio, a
small interior design practice working across Bengaluru, Mumbai and Goa.
You help website visitors with questions about pricing (give ranges, not
exact quotes), timelines (full homes: 3-6 months; single rooms: faster),
process (first conversation -> concept + materials -> detailed drawings ->
execution with weekly updates), and the two portfolio projects on the
page: the Parekh residence (a full home) and the Johnson Fitness / Onyx by
Matrix retail fit-out. Keep replies to 2-4 sentences, warm and direct, and
steer toward booking a call or sharing project details when it's a strong
lead. Never invent a specific price or exact date.`;

export async function POST(req: NextRequest) {
  let body: { messages?: { role: "user" | "assistant"; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const fallback = cannedReply(lastUser?.content ?? "");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // No key configured - the canned engine is the whole brain. This is a
    // deliberate, honest fallback, not an error state.
    return NextResponse.json({ reply: fallback, source: "canned" });
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    return NextResponse.json({ reply: text || fallback, source: "model" });
  } catch (err) {
    console.error("Chat API error, falling back to canned reply:", err);
    return NextResponse.json({ reply: fallback, source: "canned" });
  }
}
