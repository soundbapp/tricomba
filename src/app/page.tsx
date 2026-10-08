import Link from "next/link";
import { ChallengePost, FighterCard, Photo, SectionHead, StoryStrip } from "@/components/ui";
import { getMergedChallenges } from "@/lib/combatants";
import { featuredChallengeId, fighters, getFighter } from "@/lib/data";

export default async function HomePage() {
  const { challenges, combatants } = await getMergedChallenges();
  const featured =
    challenges.find((challenge) => challenge.id === featuredChallengeId) ?? challenges[0];
  const left = featured
    ? combatants.find((f) => f.slug === featured.challengerSlug) ??
      getFighter(featured.challengerSlug)
    : fighters[0];
  const right = featured
    ? combatants.find((f) => f.slug === featured.opponentSlug) ?? getFighter(featured.opponentSlug)
    : fighters[1];

  const feed = [...challenges].sort((a, b) => {
    const rank = (status: string) =>
      ({ live: 0, pending: 1, negotiating: 2, accepted: 3, scheduled: 4, completed: 5, declined: 6 })[
        status
      ] ?? 9;
    return rank(a.status) - rank(b.status);
  });

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          {left ? <Photo fighter={left} priority sizes="50vw" /> : null}
          {right ? <Photo fighter={right} priority sizes="50vw" /> : null}
        </div>
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="brand-hero">TRICOMBA</span>
          <h1>Trial by combat — for the feed.</h1>
          <p>
            Drop a challenge. If they accept, settle it for real in a licensed gym — boxing, MMA,
            wrestling, martial arts. Not in the comments.
          </p>
          <div className="hero-actions">
            <Link href="/challenges/new" className="btn btn-solid">
              Drop a challenge
            </Link>
            <Link href="/challenges" className="btn btn-ghost">
              Open the feed
            </Link>
          </div>
        </div>
      </section>

      <StoryStrip items={challenges} combatants={combatants} />

      <SectionHead kicker="For you" title="Challenge feed" href="/challenges" linkLabel="All" />
      <div className="feed">
        {feed.slice(0, 5).map((challenge, index) => (
          <ChallengePost
            key={challenge.id}
            challenge={challenge}
            combatants={combatants}
            priority={index === 0}
          />
        ))}
      </div>

      <SectionHead kicker="How it works" title="Three moves" />
      <div className="how-strip">
        <article className="how-chip">
          <span>01</span>
          <strong>Drop</strong>
          <p>Tag someone. Pick the sport. Say the beef.</p>
        </article>
        <article className="how-chip">
          <span>02</span>
          <strong>Accept</strong>
          <p>They reply, negotiate, or pass. Two yeses only.</p>
        </article>
        <article className="how-chip">
          <span>03</span>
          <strong>Fight</strong>
          <p>A partnered gym books the real bout. You watch.</p>
        </article>
      </div>

      <SectionHead kicker="People" title="On the app" />
      <div className="people">
        {fighters.slice(0, 6).map((fighter) => (
          <FighterCard key={fighter.slug} fighter={fighter} />
        ))}
      </div>
    </>
  );
}
