"use client";

interface ChatBubbleProps {
  children: React.ReactNode;
}

export function ChatBubble({ children }: ChatBubbleProps) {
  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
        CX
      </div>
      <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-5 py-4 max-w-lg">
        <div className="text-sm leading-relaxed space-y-2">{children}</div>
      </div>
    </div>
  );
}
