// Shared logo mark — journey arc with 3 nodes
// Used in: nav-header, landing page header/footer, print cover

interface LogoMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LogoMark({ className = "", size = "md" }: LogoMarkProps) {
  const dims = size === "sm" ? { box: "w-6 h-6", svg: 14 } : size === "lg" ? { box: "w-10 h-10", svg: 22 } : { box: "w-8 h-8", svg: 18 };
  return (
    <div
      className={`${dims.box} rounded-lg flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ backgroundColor: "#0D9488" }}
    >
      <svg viewBox="0 0 22 22" width={dims.svg} height={dims.svg} fill="none">
        {/* Three journey nodes: start → mid → destination */}
        <circle cx="3"  cy="18" r="2.2" fill="white" />
        <circle cx="11" cy="11" r="2.2" fill="white" />
        <circle cx="19" cy="4"  r="2.2" fill="white" />
        {/* Smooth ascending path connecting the nodes */}
        <path
          d="M 3 18 C 6 15 8.5 12.5 11 11 C 13.5 9.5 16 6.5 19 4"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
