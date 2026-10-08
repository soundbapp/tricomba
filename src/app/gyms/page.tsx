import type { Metadata } from "next";
import Image from "next/image";
import { gyms } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gyms",
};

export default function GymsPage() {
  return (
    <div className="page-pad">
      <p className="kicker">Partners</p>
      <h1>Gyms</h1>
      <p className="lede">
        The feed books real rooms — places that already run medicals, officials, and insurance.
      </p>
      <div className="stack" style={{ marginTop: "1rem" }}>
        {gyms.map((gym) => (
          <article key={gym.slug} className="gym-card" style={{ margin: 0, overflow: "hidden" }}>
            <div className="photo" style={{ minHeight: 200, margin: "-1rem -1rem 1rem", borderRadius: 0 }}>
              <Image
                src={gym.image}
                alt={gym.name}
                fill
                sizes="(max-width: 860px) 100vw, 720px"
              />
            </div>
            <p className="kicker">
              {gym.city}, {gym.country}
            </p>
            <h3 style={{ margin: "0.2rem 0 0.45rem", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
              {gym.name}
            </h3>
            <p style={{ margin: 0, color: "var(--mute)" }}>{gym.note}</p>
            <p className="mono" style={{ marginTop: "0.55rem" }}>
              {gym.disciplines.join(" · ")}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
