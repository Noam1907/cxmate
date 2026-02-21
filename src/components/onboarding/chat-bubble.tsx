"use client";

interface ChatBubbleProps {
  children: React.ReactNode;
}

export function ChatBubble({ children }: ChatBubbleProps) {
  return (
    <div className="flex gap-3 mb-8">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
        CX
      </div>
      <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-5 py-4 max-w-lg border border-border/40">
        <div className="text-sm leading-relaxed space-y-2 text-foreground">{children}</div>
      </div>
    </div>
  );
}
