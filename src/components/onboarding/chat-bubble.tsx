"use client";

interface ChatBubbleProps {
  children: React.ReactNode;
}

export function ChatBubble({ children }: ChatBubbleProps) {
  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
        CX
      </div>
      <div className="bg-secondary rounded-2xl rounded-tl-md px-5 py-4 max-w-lg border border-primary/10">
        <div className="text-sm leading-relaxed space-y-2 text-foreground">{children}</div>
      </div>
    </div>
  );
}
