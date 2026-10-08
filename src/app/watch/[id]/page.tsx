import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WatchDesk } from "@/components/watch-desk";
import { Photo, StatusMark } from "@/components/ui";
import { challenges, getChallenge, getFighter, getGym } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export function generateStaticParams() {
  return challenges
    .filter(
      (challenge) =>
        challenge.status === "live" ||
        challenge.status === "scheduled" ||
        challenge.status === "completed",
    )
    .map((challenge) => ({ id: challenge.id }));
}

type WatchPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const challenge = getChallenge(id);
  return { title: challenge ? `Watch ${challenge.id}` : "Watch" };
}

export default async function WatchEventPage({ params }: WatchPageProps) {
  const { id } = await params;
  const challenge = getChallenge(id);
  if (!challenge) notFound();

  const challenger = getFighter(challenge.challengerSlug);
  const opponent = getFighter(challenge.opponentSlug);
  const gym = challenge.venueSlug ? getGym(challenge.venueSlug) : undefined;
  if (!challenger || !opponent) notFound();

  return (
    <div>
      <div className="page-pad">
        <p className="kicker">
          {challenge.access === "ppv" ? `PPV · $${challenge.price}` : "Free card"}
        </p>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <StatusMark status={challenge.status} />
          <span className="mono">{challenge.discipline}</span>
        </div>
        <h1>
          {challenger.name} vs {opponent.name}
        </h1>
      </div>
      <WatchDesk challenge={challenge} />
      <div className="post-media" style={{ margin: "0.85rem 0" }}>
        <Photo fighter={challenger} />
        <Photo fighter={opponent} />
        <span className="post-vs" aria-hidden="true">
          vs
        </span>
      </div>
      <section className="detail-panel">
        <p>{challenge.grievance}</p>
        <p className="mono">
          {gym ? `${gym.name}, ${gym.city}` : "Venue pending"}
          {challenge.eventDate ? ` · ${formatDateTime(challenge.eventDate)}` : ""}
        </p>
        {challenge.result ? <p>Result: {challenge.result}</p> : null}
        <Link href={`/challenges/${challenge.id}`} className="text-link">
          Full challenge
        </Link>
      </section>
    </div>
  );
}
