import Image from "next/image";
import Link from "next/link";
import type { Challenge, Fighter } from "@/lib/types";
import { challenges as catalogChallenges, fighters, getGym } from "@/lib/data";
import { resolveFighter } from "@/lib/combatants";
import { statusCopy, timeAgo } from "@/lib/format";

export function Photo({
  fighter,
  className = "",
  priority = false,
  sizes = "(max-width: 860px) 50vw, 420px",
}: {
  fighter: Fighter;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={fighter.image}
        alt={fighter.name}
        fill
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

export function Avatar({
  fighter,
  ring = false,
  live = false,
}: {
  fighter: Fighter;
  ring?: boolean;
  live?: boolean;
}) {
  return (
    <span className={`avatar ${ring ? "avatar-ring" : ""} ${live ? "avatar-live" : ""}`}>
      <Image src={fighter.image} alt="" fill sizes="72px" />
    </span>
  );
}

export function StatusMark({ status }: { status: Challenge["status"] }) {
  return <span className={`status status-${status}`}>{statusCopy[status]}</span>;
}

export function StoryStrip({
  items = catalogChallenges,
  combatants = fighters,
}: {
  items?: Challenge[];
  combatants?: Fighter[];
}) {
  const hot = items.filter((c) =>
    ["live", "pending", "negotiating", "scheduled", "accepted"].includes(c.status),
  );

  return (
    <div className="stories" aria-label="Hot challenges">
      {hot.slice(0, 8).map((challenge) => {
        const challenger = resolveFighter(challenge.challengerSlug, combatants);
        const opponent = resolveFighter(challenge.opponentSlug, combatants);
        if (!challenger || !opponent) return null;
        return (
          <Link
            key={challenge.id}
            href={
              challenge.status === "live"
                ? `/watch/${challenge.id}`
                : `/challenges/${challenge.id}`
            }
            className="story"
          >
            <Avatar fighter={challenger} ring live={challenge.status === "live"} />
            <span className="story-name">{challenger.name.split(" ")[0]}</span>
            <span className="story-vs">vs {opponent.name.split(" ")[0]}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function ChallengePost({
  challenge,
  combatants = fighters,
  priority = false,
}: {
  challenge: Challenge;
  combatants?: Fighter[];
  priority?: boolean;
}) {
  const challenger = resolveFighter(challenge.challengerSlug, combatants);
  const opponent = resolveFighter(challenge.opponentSlug, combatants);
  const gym = challenge.venueSlug ? getGym(challenge.venueSlug) : undefined;
  if (!challenger || !opponent) return null;

  const watchHref =
    challenge.status === "live" ||
    challenge.status === "scheduled" ||
    challenge.status === "completed"
      ? `/watch/${challenge.id}`
      : `/challenges/${challenge.id}`;

  const profileHref = fighters.some((f) => f.slug === challenger.slug)
    ? `/fighters/${challenger.slug}`
    : `/join`;

  return (
    <article className="post reveal">
      <header className="post-head">
        <Link href={profileHref} className="post-user">
          <Avatar fighter={challenger} />
          <div>
            <strong>{challenger.name}</strong>
            <span>
              challenged {opponent.name} · {timeAgo(challenge.issuedAt)}
            </span>
          </div>
        </Link>
        <StatusMark status={challenge.status} />
      </header>

      <Link href={`/challenges/${challenge.id}`} className="post-media">
        <Photo fighter={challenger} priority={priority} />
        <Photo fighter={opponent} priority={priority} />
        <span className="post-vs" aria-hidden="true">
          vs
        </span>
      </Link>

      <div className="post-actions">
        <Link href={`/challenges/${challenge.id}`}>Reply</Link>
        <Link href={watchHref}>
          {challenge.status === "live" ? "Watch live" : "Open"}
        </Link>
        <Link href={`/fighters/${opponent.slug}`}>Profile</Link>
      </div>

      <div className="post-caption">
        <p>
          <strong>
            {challenger.name.split(" ")[0]} → {opponent.name.split(" ")[0]}
          </strong>{" "}
          {challenge.grievance}
        </p>
        <p className="post-meta">
          {challenge.discipline} · {challenge.weightClass} · {challenge.rounds}
          {gym ? ` · ${gym.city}` : ""}
          {challenge.access === "ppv" ? ` · $${challenge.price}` : " · Free"}
        </p>
      </div>
    </article>
  );
}

export function Docket({
  challenge,
  href,
  featured = false,
  priority = false,
}: {
  challenge: Challenge;
  href: string;
  featured?: boolean;
  priority?: boolean;
}) {
  void href;
  void featured;
  return <ChallengePost challenge={challenge} priority={priority} />;
}

export function ChallengeCard({
  challenge,
  combatants,
}: {
  challenge: Challenge;
  combatants?: Fighter[];
}) {
  return <ChallengePost challenge={challenge} combatants={combatants} />;
}

export function FighterCard({ fighter }: { fighter: Fighter }) {
  return (
    <Link href={`/fighters/${fighter.slug}`} className="person reveal">
      <Avatar fighter={fighter} ring />
      <div>
        <strong>{fighter.name}</strong>
        <span>
          {fighter.city} · {fighter.discipline}
        </span>
      </div>
    </Link>
  );
}

export function SectionHead({
  kicker,
  title,
  href,
  linkLabel,
}: {
  kicker: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <p className="kicker">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {href ? (
        <Link href={href} className="text-link">
          {linkLabel ?? "See all"}
        </Link>
      ) : null}
    </div>
  );
}

export const Portrait = Photo;
export const StatusPill = StatusMark;
export const BoutPoster = Docket;
