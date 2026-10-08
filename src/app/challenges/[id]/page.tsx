import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeDetail } from "@/components/challenge-detail";
import { fighterFromProfile, getMergedChallenges } from "@/lib/combatants";
import { getChallengeShareCard } from "@/lib/challenge-share";
import { getDbChallengeByPublicId, mapDbChallenge } from "@/lib/challenges-db";
import { challenges } from "@/lib/data";
import { getProfileById } from "@/lib/profiles";

export function generateStaticParams() {
  return challenges.map((challenge) => ({ id: challenge.id }));
}

type ChallengePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ChallengePageProps): Promise<Metadata> {
  const { id } = await params;
  const card = await getChallengeShareCard(id);
  if (!card) return { title: "Challenge" };

  const title = `${card.challengerName} vs ${card.opponentName}`;
  const description = `${card.challenge.discipline} · ${card.challenge.weightClass}. ${card.summary}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — TRICOMBA`,
      description,
      type: "website",
      siteName: "TRICOMBA",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — TRICOMBA`,
      description,
    },
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { id } = await params;
  const { challenges: merged, combatants } = await getMergedChallenges();
  let challenge = merged.find((item) => item.id === id) ?? null;
  let extras = combatants;

  if (!challenge) {
    const dbRow = await getDbChallengeByPublicId(id);
    if (dbRow) {
      challenge = mapDbChallenge(dbRow);
      const profile = await getProfileById(dbRow.challengerId);
      if (profile) extras = [...combatants, fighterFromProfile(profile)];
    }
  }

  if (!challenge) {
    return (
      <div className="page-pad">
        <p className="kicker">Missing</p>
        <h1>This challenge isn’t in the feed.</h1>
        <p className="lede">It may have been removed, or the link is old.</p>
        <div className="hero-actions">
          <Link href="/challenges" className="btn btn-solid">
            Back to feed
          </Link>
          <Link href="/challenges/new" className="btn btn-ghost">
            Drop a challenge
          </Link>
        </div>
      </div>
    );
  }

  return <ChallengeDetail challenge={challenge} combatants={extras} />;
}
