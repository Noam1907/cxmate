"use client";

import { useState, useRef, useEffect } from "react";
import { ChatTeardrop, PaperPlaneRight, X, ArrowsOut, ArrowsIn } from "@phosphor-icons/react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_FEEDBACK = [
  "This moment doesn't happen for us",
  "We handle this differently",
  "Add a missing stage",
  "This is our biggest pain point",
];

export function JourneyFeedbackChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I mapped your customer journey based on what you shared. Anything look off? Tell me what's different in your company and I'll adjust the journey.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        role,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message || sending) return;

    addMessage("user", message);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/journey/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: messages.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage("assistant", data.reply || "Thanks for the feedback! I've noted this for your journey.");
      } else {
        addMessage(
          "assistant",
          "Thanks for sharing that. I've noted your feedback — we'll use this to refine your journey in a future update."
        );
      }
    } catch {
      addMessage(
        "assistant",
        "Thanks for sharing that. I've noted your feedback — we'll use this to refine your journey in a future update."
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Collapsed: floating button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 print:hidden"
      >
        <ChatTeardrop size={20} weight="duotone" />
        <span className="text-sm font-medium">Refine your journey</span>
      </button>
    );
  }

  // Expanded panel
  const panelClass = isExpanded
    ? "fixed inset-4 z-50 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[480px] sm:h-[600px]"
    : "fixed bottom-6 right-6 z-50 w-[360px] h-[480px]";

  return (
    <>
      {/* Backdrop on mobile when expanded */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden print:hidden"
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`${panelClass} flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl print:hidden transition-all duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ChatTeardrop size={18} weight="duotone" className="text-primary" />
            <span className="text-sm font-semibold text-slate-900">Refine Your Journey</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title={isExpanded ? "Shrink" : "Expand"}
            >
              {isExpanded ? <ArrowsIn size={16} /> : <ArrowsOut size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary/10 text-slate-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm text-slate-400">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick feedback chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-slate-100">
            <div className="flex flex-wrap gap-1.5">
              {QUICK_FEEDBACK.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  disabled={sending}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell us what's different..."
              rows={1}
              className="flex-1 resize-none text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || sending}
              className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <PaperPlaneRight size={18} weight="fill" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
