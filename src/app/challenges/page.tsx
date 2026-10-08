import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeFeed } from "@/components/challenge-feed";
import { StoryStrip } from "@/components/ui";
import { getMergedChallenges } from "@/lib/combatants";

export const metadata: Metadata = {
  title: "Feed",
};

export default async function ChallengesPage() {
  const { challenges, combatants } = await getMergedChallenges();

  return (
    <div>
      <div className="page-pad">
        <p className="kicker">Social card</p>
        <h1>Challenge feed</h1>
        <p className="lede">
          Public beefs. Formal terms. If both people accept, it leaves the feed and enters a gym.
        </p>
        <div className="hero-actions">
          <Link href="/challenges/new" className="btn btn-solid">
            Drop a challenge
          </Link>
        </div>
      </div>
      <StoryStrip items={challenges} combatants={combatants} />
      <ChallengeFeed challenges={challenges} combatants={combatants} />
    </div>
  );
}
