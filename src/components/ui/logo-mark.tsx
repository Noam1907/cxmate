// Shared logo mark — journey arc with 3 nodes (small → medium → large)
// Matches the approved generated logo: single upward arc, exponential curve, bold weight
// Used in: nav-header, landing page header/footer, print cover, dashboard cards

interface LogoMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LogoMark({ className = "", size = "md" }: LogoMarkProps) {
  const dims =
    size === "sm" ? { box: "w-6 h-6", svg: 13 } :
    size === "lg" ? { box: "w-10 h-10", svg: 22 } :
                   { box: "w-8 h-8", svg: 18 };

  return (
    <div
      className={`${dims.box} rounded-lg flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ backgroundColor: "#0D9488" }}
    >
      <svg viewBox="0 0 22 22" width={dims.svg} height={dims.svg} fill="none">
        {/*
          Arc: exponential-style curve — starts nearly flat at bottom-left,
          sweeps steeply upward to top-right. Single bezier, no S-curve.
          Rendered first so nodes sit on top.
        */}
        <path
          d="M 4 18 C 4.5 13 13 7.5 18 4"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Start node — small */}
        <circle cx="4"  cy="18" r="2.0" fill="white" />
        {/* Mid node — medium, positioned on the curve at t≈0.5 */}
        <circle cx="11" cy="11.5" r="2.8" fill="white" />
        {/* Destination node — large, signals arrival */}
        <circle cx="18" cy="4"   r="3.8" fill="white" />
      </svg>
    </div>
  );
}
