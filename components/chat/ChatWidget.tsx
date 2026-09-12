"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import ChatAvatar from "./ChatAvatar";
import { SUGGESTED_QUESTIONS, cannedReply } from "@/lib/chatResponses";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi, I'm Maya \u2014 the studio assistant. Ask about pricing, timelines, or the projects on this page.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasOpenedOnce = useRef(false);

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
      );
      hasOpenedOnce.current = true;
      setUnread(false);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // A single, gentle unread nudge a little while after first paint, so the
  // widget doesn't feel dead but also never nags.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasOpenedOnce.current) setUnread(true);
    }, 14000);
    return () => clearTimeout(t);
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: cannedReply(trimmed) }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {open && (
        <div
          ref={panelRef}
          className="flex h-[70vh] max-h-[560px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-3.5">
            <ChatAvatar size={36} pulse />
            <div className="min-w-0 flex-1">
              <p className="font-body text-[13px] font-medium text-stone-900">Maya</p>
              <p className="truncate font-body text-[11px] text-stone-500">Studio assistant &middot; usually replies in minutes</p>
            </div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
            >
              &#10005;
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 font-body text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-stone-900 text-stone-50"
                      : "rounded-bl-sm bg-white text-stone-700 shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && !typing && (
              <div className="flex flex-col gap-2 pt-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-stone-300 bg-white px-3.5 py-2 text-left font-body text-[12.5px] text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-900"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-stone-200 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your project..."
              className="flex-1 rounded-full border border-stone-300 bg-stone-50 px-4 py-2.5 font-body text-[13px] text-stone-800 outline-none placeholder:text-stone-400 focus:border-stone-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-stone-50 transition-opacity disabled:opacity-30"
            >
              &#8593;
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 shadow-xl transition-transform hover:scale-105"
      >
        {open ? (
          <span className="font-body text-lg text-stone-50">&#10005;</span>
        ) : (
          <ChatAvatar size={40} />
        )}
        {!open && unread && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay-500 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-stone-50 bg-clay-500" />
          </span>
        )}
      </button>
    </div>
  );
}
