"use client";

import { useState, useRef, useEffect } from "react";
import type { Profile } from "@/app/lib/types";
import type { ChatMessage } from "@/app/lib/types";
import { sendChat } from "@/app/lib/api";
import { weakTopics } from "@/app/lib/helpers";
import { Send } from "lucide-react";

interface Props {
  profile: Profile;
}

// Typing indicator — three bouncing dots
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      {/* Mentor avatar */}
      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-sm shrink-0">
        🎓
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400 inline-block animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Single message bubble
function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-sm shrink-0">
          🎓
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function MentorChat({ profile }: Props) {
  const weak = weakTopics(profile.subjects);

  // Starter prompts generated from actual weak topics
  const starterPrompts = [
    ...(weak.slice(0, 2).map((w) => `Help me with ${w.topic} 📚`)),
    "What should I study today? 🎯",
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: weak.length > 0
        ? `Hi ${profile.name}! I can see ${weak[0].topic} is a weak spot for you (${weak[0].score}%). Want to work on it together? I'll make it simple. 😊`
        : `Hi ${profile.name}! Great work — no weak topics right now. Want to push your scores even higher? 💪`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
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
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-1.5rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
          🎓
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">AI Mentor</p>
          <p className="text-xs text-emerald-500 font-medium">● Online</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-slate-50">
        {messages.map((msg, i) => (
          <Bubble key={i} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Starter prompts — shown only when no conversation yet (just the greeting) */}
      {messages.length === 1 && !isTyping && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-2">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => send(prompt)}
                className="text-xs bg-white border border-indigo-200 text-indigo-600 rounded-full px-3 py-1.5 hover:bg-indigo-50 transition-colors font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 bg-white border-t border-slate-100">
        <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 px-3 py-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your mentor anything…"
            rows={1}
            disabled={isTyping}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none resize-none max-h-28 py-1 disabled:opacity-50"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
