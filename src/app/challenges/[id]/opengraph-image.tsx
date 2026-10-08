import { ImageResponse } from "next/og";
import { getChallengeShareCard } from "@/lib/challenge-share";

export const alt = "TRICOMBA challenge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ id: string }> };

export default async function Image({ params }: Props) {
  const { id } = await params;
  const card = await getChallengeShareCard(id);
  const left = card?.challengerName ?? "Challenger";
  const right = card?.opponentName ?? "Opponent";
  const discipline = card?.challenge.discipline ?? "Combat";
  const status = card?.challenge.status ?? "pending";
  const grievance = card?.summary ?? "Trial by combat — for the feed.";

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
          background: "linear-gradient(160deg, #ffffff 0%, #f3f3f5 55%, #ffe5ea 100%)",
          color: "#111114",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-0.06em",
            }}
          >
            TRICOMBA
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: 999,
              background: "#ff2546",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {status}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 28,
              color: "#6b6b76",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Trial by combat · {discipline}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
            }}
          >
            <span>{left}</span>
            <span style={{ color: "#ff2546", fontSize: 48 }}>vs</span>
            <span>{right}</span>
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#6b6b76",
              maxWidth: 980,
              lineHeight: 1.35,
            }}
          >
            {grievance}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#6b6b76",
          }}
        >
          <span>{id}</span>
          <span>Challenge anyone. Settle it for real.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
