"use client";

interface SidebarSectionProps {
  label: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({
  label,
  icon,
  children,
  className = "",
}: SidebarSectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        {icon && <span className="mr-1.5">{icon}</span>}
        {label}
      </h3>
      <div>{children}</div>
    </div>
  );
}

// Placeholder for sections that haven't been filled yet
export function SidebarPlaceholder({ label }: { label: string }) {
  return (
    <div className="space-y-2 opacity-30">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        {label}
      </h3>
      <div className="h-8 rounded-lg border border-dashed border-sidebar-border" />
    </div>
  );
}
