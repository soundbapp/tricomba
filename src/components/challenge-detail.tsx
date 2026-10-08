"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getGym } from "@/lib/data";
import { resolveFighter } from "@/lib/combatants";
import { formatDateTime } from "@/lib/format";
import type { Challenge, Fighter } from "@/lib/types";
import { ChallengeActions } from "./challenge-actions";
import { ShareChallenge } from "./share-challenge";
import { Photo, StatusMark } from "./ui";

export function ChallengeDetail({
  challenge,
  combatants,
}: {
  challenge: Challenge;
  combatants: Fighter[];
}) {
  const [liveChallenge, setLiveChallenge] = useState(challenge);

  useEffect(() => {
    setLiveChallenge(challenge);
  }, [challenge]);

  const challenger = resolveFighter(liveChallenge.challengerSlug, combatants);
  const opponent = resolveFighter(liveChallenge.opponentSlug, combatants);
  const gym = liveChallenge.venueSlug ? getGym(liveChallenge.venueSlug) : undefined;

  if (!challenger || !opponent) {
    return (
      <div className="page-pad">
        <p className="kicker">Missing</p>
        <h1>This challenge isn’t in the feed.</h1>
        <Link href="/challenges" className="btn btn-solid">
          Back to feed
        </Link>
      </div>
    );
  }

  const watchable =
    liveChallenge.status === "live" ||
    liveChallenge.status === "scheduled" ||
    liveChallenge.status === "completed";

  return (
    <div>
      <div className="page-pad">
        <p className="kicker">{liveChallenge.id}</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
          <StatusMark status={liveChallenge.status} />
          <span className="mono">
            {liveChallenge.discipline} · {liveChallenge.weightClass}
          </span>
        </div>
        <h1>
          {challenger.name} vs {opponent.name}
        </h1>
        <p className="lede">{liveChallenge.grievance}</p>
        <ShareChallenge
          title={`${challenger.name} vs ${opponent.name} — TRICOMBA`}
          text={liveChallenge.grievance}
        />
      </div>

      <div className="post-media" style={{ marginBottom: "0.75rem" }}>
        <Photo fighter={challenger} />
        <Photo fighter={opponent} />
        <span className="post-vs" aria-hidden="true">
          vs
        </span>
      </div>

      <div className="detail-split">
        <section className="detail-panel">
          <p className="kicker">Terms</p>
          <h2>{liveChallenge.rounds}</h2>
          <p>{liveChallenge.terms}</p>
          {liveChallenge.counterTerms ? (
            <p>
              <strong>Counter-terms:</strong> {liveChallenge.counterTerms}
            </p>
          ) : null}
          {gym ? (
            <p>
              Gym: <Link href="/gyms">{gym.name}</Link>, {gym.city}
            </p>
          ) : (
            <p>Gym assigned after both people accept.</p>
          )}
          {liveChallenge.eventDate ? <p>{formatDateTime(liveChallenge.eventDate)}</p> : null}
          {liveChallenge.result ? <p>Result: {liveChallenge.result}</p> : null}
          {watchable ? (
            <Link
              href={`/watch/${liveChallenge.id}`}
              className="btn btn-solid"
              style={{ marginTop: "1rem" }}
            >
              {liveChallenge.status === "live" ? "Watch live" : "Open watch"}
            </Link>
          ) : null}
        </section>
        <section className="detail-panel">
          <p className="kicker">Reply</p>
          <p>
            {challenger.name} · {challenger.record}
          </p>
          <p>
            <Link href={`/fighters/${opponent.slug}`}>{opponent.name}</Link>
            {" · "}
            {opponent.record}
          </p>
          <ChallengeActions
            publicId={liveChallenge.id}
            initialStatus={liveChallenge.status}
            canRespond={
              liveChallenge.status === "pending" || liveChallenge.status === "negotiating"
            }
          />
        </section>
      </div>
    </div>
  );
}
