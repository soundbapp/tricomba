import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChallengePost, Photo } from "@/components/ui";
import { challengesForFighter, fighters, getFighter } from "@/lib/data";
import { displayName } from "@/lib/format";

export function generateStaticParams() {
  return fighters.map((fighter) => ({ slug: fighter.slug }));
}

type FighterPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: FighterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fighter = getFighter(slug);
  return { title: fighter ? displayName(fighter.name, fighter.moniker) : "Profile" };
}

export default async function FighterPage({ params }: FighterPageProps) {
  const { slug } = await params;
  const fighter = getFighter(slug);
  if (!fighter) notFound();

  const bouts = challengesForFighter(fighter.slug);

  return (
    <div>
      <div className="profile-hero">
        <Photo fighter={fighter} priority />
        <div className="profile-copy">
          <p className="kicker">{fighter.verified ? "Verified" : "Open profile"}</p>
          <h1>{fighter.name}</h1>
          <p className="mono">
            {fighter.record} · {fighter.discipline} · {fighter.city}
          </p>
          <p className="lede">{fighter.bio}</p>
          <Link href="/challenges/new" className="btn btn-solid">
            Challenge {fighter.name.split(" ")[0]}
          </Link>
        </div>
      </div>
      <Sectionish />
      <div className="feed">
        {bouts.map((challenge) => (
          <ChallengePost key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}

function Sectionish() {
  return (
    <div className="section-head">
      <div>
        <p className="kicker">Activity</p>
        <h2>Their challenges</h2>
      </div>
    </div>
  );
}
