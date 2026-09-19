"use client";

import { useState, useRef, useEffect } from "react";
import type { Profile } from "@/app/lib/types";
import type { ChatMessage } from "@/app/lib/types";
import { sendChat } from "@/app/lib/api";
import { weakTopics } from "@/app/lib/helpers";
import { useToast } from "@/app/lib/toast";
import { Send } from "lucide-react";

interface Props {
  profile: Profile;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        🤖
      </div>
      <div
        className="rounded-2xl rounded-bl-sm px-4 py-3"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-1.5 px-1 py-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full inline-block animate-bounce"
              style={{ background: "#00d4ff", animationDelay: `${i * 0.15}s`, opacity: 0.7 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg, profile }: { msg: ChatMessage; profile: Profile }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          🤖
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser ? "rounded-br-sm" : "rounded-bl-sm"
        }`}
        style={
          isUser
            ? {
                background: "rgba(0,212,255,0.10)",
                border: "1px solid rgba(0,212,255,0.20)",
                color: "var(--text-1)",
              }
            : {
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-2)",
              }
        }
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function MentorChat({ profile }: Props) {
  const weak = weakTopics(profile.subjects);
  const { showError } = useToast();

  const starterPrompts = [
    ...(weak.slice(0, 2).map((w) => `Help me with ${w.topic} 📚`)),
    "What should I study today? 🎯",
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        weak.length > 0
          ? `Hi ${profile.name}! I can see ${weak[0].topic} is a focus area (${weak[0].score}%). Let's work on it — I'll keep it simple. 😊`
          : `Hi ${profile.name}! All vectors look good — no weak topics. Want to push even higher? 💪`,
    },
  ]);
  const [input,    setInput]    = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsTyping(true);
    try {
      const { reply } = await sendChat(trimmed, updated);
      setMessages([...updated, { role: "assistant", content: reply }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Couldn't reach the mentor. Check your connection.";
      showError(msg);
      setMessages([...updated, { role: "assistant", content: "Sorry — couldn't get a response right now. Try again! 🙏" }]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div
      className="flex flex-col max-w-2xl mx-auto"
      style={{ height: "calc(100dvh - 5rem)" }}
    >
      {/* ── Header ── */}
      <div
        className="px-5 py-3 flex items-center gap-3 shrink-0"
        style={{
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-base"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          🤖
        </div>
        <div>
          <p className="font-display text-sm font-semibold" style={{ color: "var(--text-1)" }}>
            AI Mentor
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#00d4aa" }} />
            <p className="label-tele" style={{ color: "#00d4aa" }}>ONLINE · CONTEXTUAL</p>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ background: "var(--canvas)" }}
      >
        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} profile={profile} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Starter prompts ── */}
      {messages.length === 1 && (
        <div
          className="px-4 py-3 flex gap-2 overflow-x-auto shrink-0"
          style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
        >
          {starterPrompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="whitespace-nowrap text-sm px-3 py-2 rounded-lg shrink-0"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-2)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div
        className="px-4 py-3 shrink-0"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-2"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
            }}
            placeholder="Ask your mentor anything…"
            rows={1}
            className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
            style={{ color: "var(--text-1)", caretColor: "#00d4ff" }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-30"
            style={{
              background: "rgba(0,212,255,0.10)",
              border: "1px solid rgba(0,212,255,0.20)",
              color: "#00d4ff",
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
