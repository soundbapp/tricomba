import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules",
};

const rules = [
  {
    n: "01",
    title: "Adults only",
    copy: "18+ to create a profile, drop a challenge, accept one, or watch.",
  },
  {
    n: "02",
    title: "Mutual consent",
    copy: "A challenge is a post, not a summons. Accept, pass, or talk terms. Two yeses only.",
  },
  {
    n: "03",
    title: "Real sports",
    copy: "Boxing, MMA, wrestling, kickboxing, Muay Thai, BJJ. Established rulesets.",
  },
  {
    n: "04",
    title: "Licensed gyms",
    copy: "Partnered rooms handle medicals, referees, and the event.",
  },
  {
    n: "05",
    title: "The bout is the point",
    copy: "If both sides accept, it leaves the feed and becomes a contest under rules.",
  },
  {
    n: "06",
    title: "Not a street fight",
    copy: "We don’t arrange unsanctioned violence. Passing is always valid.",
  },
];

export default function RulesPage() {
  return (
    <div className="page-pad">
      <p className="kicker">House rules</p>
      <h1>Rules</h1>
      <p className="lede">
        Trial by combat, updated. TRICOMBA turns a score into a consented bout under real rules —
        and refuses the parking-lot version.
      </p>
      <div className="stack" style={{ marginTop: "1rem" }}>
        {rules.map((rule) => (
          <article key={rule.n} className="rule-card" style={{ margin: 0 }}>
            <span className="kicker">{rule.n}</span>
            <h3 style={{ margin: "0.2rem 0 0.4rem", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
              {rule.title}
            </h3>
            <p style={{ margin: 0, color: "var(--mute)" }}>{rule.copy}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
