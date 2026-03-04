"use client";

import { useState, useRef, useEffect } from "react";
import { ChatTeardrop, PaperPlaneRight, X, Check } from "@phosphor-icons/react";

interface FeedbackItem {
  id: string;
  text: string;
  timestamp: Date;
}

const QUICK_FEEDBACK = [
  "A stage is missing from my journey",
  "One of these moments doesn't apply to us",
  "The priorities feel off",
  "Something else",
];

export function JourneyFeedbackChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when feedback changes
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feedback]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addFeedback = (text: string) => {
    const item: FeedbackItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      timestamp: new Date(),
    };
    setFeedback((prev) => [...prev, item]);

    // Store in sessionStorage for future use
    try {
      const existing = JSON.parse(sessionStorage.getItem("cx-mate-journey-feedback") || "[]");
      existing.push({ text, timestamp: new Date().toISOString() });
      sessionStorage.setItem("cx-mate-journey-feedback", JSON.stringify(existing));
    } catch {
      // sessionStorage full — okay
    }
  };

  const handleSend = (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    addFeedback(message);
    setInput("");

    // Show thank you after a brief delay
    if (feedback.length >= 2) {
      setTimeout(() => setSubmitted(true), 500);
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
        <span className="text-sm font-medium">Share feedback</span>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop on mobile */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden print:hidden"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed bottom-6 right-6 z-50 w-[360px] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl print:hidden transition-all duration-200 max-h-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ChatTeardrop size={18} weight="duotone" className="text-primary" />
            <span className="text-sm font-semibold text-slate-900">Share Feedback</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Intro message */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm text-slate-600 leading-relaxed">
            See something that doesn&apos;t match your reality? Let us know. Your feedback helps us improve future journey versions.
          </p>
        </div>

        {/* Feedback items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-0">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2 text-sm bg-primary/5 rounded-lg px-3 py-2"
            >
              <Check size={14} weight="bold" className="text-primary shrink-0 mt-0.5" />
              <span className="text-slate-700">{item.text}</span>
            </div>
          ))}
          <div ref={listEndRef} />
        </div>

        {/* Submitted state */}
        {submitted ? (
          <div className="px-4 py-4 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-primary">Thanks for your feedback!</p>
            <p className="text-xs text-slate-400 mt-1">We&apos;ll use this to improve your next journey update.</p>
          </div>
        ) : (
          <>
            {/* Quick chips — show when few items */}
            {feedback.length < 3 && (
              <div className="px-4 py-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_FEEDBACK.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
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
                  placeholder="What's different in your company..."
                  rows={1}
                  className="flex-1 resize-none text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-slate-400"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <PaperPlaneRight size={18} weight="fill" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
