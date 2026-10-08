import type { Metadata } from "next";
import { ChallengePost, SectionHead } from "@/components/ui";
import { watchable } from "@/lib/data";

export const metadata: Metadata = {
  title: "Live",
};

export default function WatchPage() {
  const live = watchable.filter((challenge) => challenge.status === "live");
  const upcoming = watchable.filter((challenge) => challenge.status === "scheduled");
  const archive = watchable.filter((challenge) => challenge.status === "completed");

  return (
    <div>
      <div className="page-pad">
        <p className="kicker">Watch</p>
        <h1>Live & replays</h1>
        <p className="lede">
          Big challenges go pay-per-view. Club cards can run free with sponsors. Same feed energy —
          real rooms.
        </p>
      </div>

      {live.length ? (
        <>
          <SectionHead kicker="Now" title="Live" />
          <div className="feed">
            {live.map((challenge) => (
              <ChallengePost key={challenge.id} challenge={challenge} priority />
            ))}
          </div>
        </>
      ) : null}

      <SectionHead kicker="Up next" title="Date set" />
      <div className="feed">
        {upcoming.map((challenge) => (
          <ChallengePost key={challenge.id} challenge={challenge} />
        ))}
      </div>

      <SectionHead kicker="Archive" title="Done" />
      <div className="feed">
        {archive.map((challenge) => (
          <ChallengePost key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}
