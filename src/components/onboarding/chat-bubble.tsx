"use client";

interface ChatBubbleProps {
  children: React.ReactNode;
}

export function ChatBubble({ children }: ChatBubbleProps) {
  return (
    <div className="flex gap-3.5 mb-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-[11px] font-bold text-primary-foreground shadow-md">
        CX
      </div>
      <div className="bg-gradient-to-br from-white to-secondary/40 rounded-2xl rounded-tl-sm px-5 py-4 max-w-lg border border-border/50 shadow-sm">
        <div className="text-sm leading-relaxed space-y-2 text-foreground/90">{children}</div>
      </div>
    </div>
  );
}
