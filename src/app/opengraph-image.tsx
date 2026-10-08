import { ImageResponse } from "next/og";

export const alt = "TRICOMBA — trial by combat for the feed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "linear-gradient(160deg, #111114 0%, #2a1016 50%, #ff2546 140%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.06em" }}>TRICOMBA</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Trial by combat
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            Challenge anyone. Settle it for real.
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.75)", maxWidth: 820 }}>
            Drop a challenge. If they accept, the bout happens in a licensed gym — not in the
            comments.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.65)" }}>tricomba.vercel.app</div>
      </div>
    ),
    { ...size },
  );
}
