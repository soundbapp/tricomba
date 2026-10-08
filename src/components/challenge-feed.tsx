"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  challengeStatuses,
  disciplines,
  type Challenge,
  type ChallengeStatus,
  type Discipline,
  type Fighter,
} from "@/lib/types";
import { ChallengePost } from "./ui";

export function ChallengeFeed({
  challenges,
  combatants,
}: {
  challenges: Challenge[];
  combatants: Fighter[];
}) {
  const [discipline, setDiscipline] = useState<Discipline | "All">("All");
  const [status, setStatus] = useState<ChallengeStatus | "All">("All");

  const items = useMemo(() => {
    return challenges.filter((challenge) => {
      const disciplineOk = discipline === "All" || challenge.discipline === discipline;
      const statusOk = status === "All" || challenge.status === status;
      return disciplineOk && statusOk;
    });
  }, [challenges, discipline, status]);

  return (
    <div>
      <div className="filters">
        <label>
          Sport
          <select
            value={discipline}
            onChange={(event) => setDiscipline(event.target.value as Discipline | "All")}
          >
            <option>All</option>
            {disciplines.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ChallengeStatus | "All")}
          >
            <option>All</option>
            {challengeStatuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="feed">
        {items.map((challenge) => (
          <ChallengePost key={challenge.id} challenge={challenge} combatants={combatants} />
        ))}
        {items.length === 0 ? (
          <div className="empty-state page-pad">
            <p className="kicker">Empty lane</p>
            <h2>Nothing matches these filters.</h2>
            <p className="lede">Widen the sport or status, or drop something new onto the card.</p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setDiscipline("All");
                  setStatus("All");
                }}
              >
                Clear filters
              </button>
              <Link href="/challenges/new" className="btn btn-solid">
                Drop a challenge
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
