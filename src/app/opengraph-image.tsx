import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CX Mate — AI-Powered Customer Experience Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#E8EDE5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0D9488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 22 22" width={30} height={30} fill="none">
              <path d="M 4 18 C 4.5 13 13 7.5 18 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="4"  cy="18" r="2.0" fill="white" />
              <circle cx="11" cy="11.5" r="2.8" fill="white" />
              <circle cx="18" cy="4"   r="3.8" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px" }}>
            CX Mate
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            margin: 0,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          Your customer journey is either{" "}
          <span style={{ color: "#0D9488" }}>designed or discovered.</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: 24,
            color: "#475569",
            margin: 0,
            marginBottom: 48,
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          AI-powered CX intelligence for B2B startups.
          Map 50+ moments. Get a sprint-ready playbook. In minutes.
        </p>

        {/* Pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {["CCXP Methodology", "Live AI", "No setup required"].map((label) => (
            <div
              key={label}
              style={{
                background: "white",
                border: "2px solid #e2e8f0",
                borderRadius: 100,
                padding: "10px 20px",
                fontSize: 16,
                fontWeight: 600,
                color: "#475569",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
