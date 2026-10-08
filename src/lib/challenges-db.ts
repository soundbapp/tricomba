import { and, desc, eq, or } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { challenges, profiles, type DbChallenge } from "@/db/schema";
import type { Challenge, ChallengeStatus } from "@/lib/types";
import { getFighter } from "@/lib/data";
import { getProfileBySlug } from "@/lib/profiles";

function toPublicId() {
  return `tc-${Math.floor(1000 + Math.random() * 9000)}`;
}

export type ChallengeWithChallenger = DbChallenge & {
  challengerSlug: string;
  challengerName: string;
};

export function mapDbChallenge(row: ChallengeWithChallenger): Challenge {
  return {
    id: row.publicId,
    challengerSlug: row.challengerSlug,
    opponentSlug: row.opponentSlug,
    discipline: row.discipline as Challenge["discipline"],
    weightClass: row.weightClass as Challenge["weightClass"],
    rounds: row.rounds,
    status: row.status,
    grievance: row.grievance,
    terms: row.terms,
    counterTerms: row.counterTerms ?? undefined,
    issuedAt: row.issuedAt.toISOString(),
    venueSlug: row.venueSlug ?? undefined,
    eventDate: row.eventDate?.toISOString(),
    access: row.access ?? undefined,
    price: row.price ?? undefined,
    result: row.result ?? undefined,
  };
}

export async function listDbChallenges(): Promise<ChallengeWithChallenger[]> {
  if (!hasDatabase()) return [];
  const rows = await getDb()
    .select({
      challenge: challenges,
      challengerSlug: profiles.slug,
      challengerName: profiles.displayName,
    })
    .from(challenges)
    .innerJoin(profiles, eq(challenges.challengerId, profiles.id))
    .orderBy(desc(challenges.issuedAt));

  return rows.map((row) => ({
    ...row.challenge,
    challengerSlug: row.challengerSlug,
    challengerName: row.challengerName,
  }));
}

export async function listChallengesForProfile(input: {
  profileId: string;
  slug: string;
}): Promise<ChallengeWithChallenger[]> {
  if (!hasDatabase()) return [];
  const rows = await getDb()
    .select({
      challenge: challenges,
      challengerSlug: profiles.slug,
      challengerName: profiles.displayName,
    })
    .from(challenges)
    .innerJoin(profiles, eq(challenges.challengerId, profiles.id))
    .where(
      or(
        eq(challenges.challengerId, input.profileId),
        eq(challenges.opponentSlug, input.slug),
      ),
    )
    .orderBy(desc(challenges.issuedAt));

  return rows.map((row) => ({
    ...row.challenge,
    challengerSlug: row.challengerSlug,
    challengerName: row.challengerName,
  }));
}

export async function getDbChallengeByPublicId(publicId: string) {
  if (!hasDatabase()) return null;
  const [row] = await getDb()
    .select({
      challenge: challenges,
      challengerSlug: profiles.slug,
      challengerName: profiles.displayName,
    })
    .from(challenges)
    .innerJoin(profiles, eq(challenges.challengerId, profiles.id))
    .where(eq(challenges.publicId, publicId))
    .limit(1);

  if (!row) return null;
  return {
    ...row.challenge,
    challengerSlug: row.challengerSlug,
    challengerName: row.challengerName,
  } satisfies ChallengeWithChallenger;
}

export async function createChallenge(input: {
  challengerId: string;
  challengerSlug: string;
  opponentSlug: string;
  discipline: string;
  weightClass: string;
  rounds: string;
  grievance: string;
  terms: string;
}) {
  if (!hasDatabase()) {
    throw new Error("Database is not configured.");
  }
  if (input.opponentSlug === input.challengerSlug) {
    throw new Error("You can’t challenge yourself.");
  }

  const catalogOpponent = getFighter(input.opponentSlug);
  const profileOpponent = catalogOpponent
    ? null
    : await getProfileBySlug(input.opponentSlug);
  if (!catalogOpponent && !profileOpponent) {
    throw new Error("Opponent not found. Search the public card or a member name.");
  }

  const db = getDb();
  let publicId = toPublicId();
  for (let i = 0; i < 5; i += 1) {
    const [exists] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.publicId, publicId))
      .limit(1);
    if (!exists) break;
    publicId = toPublicId();
  }

  const [created] = await db
    .insert(challenges)
    .values({
      publicId,
      challengerId: input.challengerId,
      opponentSlug: input.opponentSlug,
      opponentProfileId: profileOpponent?.id ?? null,
      discipline: input.discipline,
      weightClass: input.weightClass,
      rounds: input.rounds,
      grievance: input.grievance,
      terms: input.terms,
      status: "pending",
      access: "free",
    })
    .returning();

  return created;
}

export async function respondToChallenge(input: {
  publicId: string;
  status: Extract<ChallengeStatus, "accepted" | "negotiating" | "declined">;
  counterTerms?: string;
  responderProfileId: string;
}) {
  if (!hasDatabase()) {
    throw new Error("Database is not configured.");
  }

  const existing = await getDbChallengeByPublicId(input.publicId);
  if (!existing) {
    throw new Error("Challenge not found in the database. Drop a new one while signed in.");
  }
  if (existing.challengerId === input.responderProfileId) {
    throw new Error("You can’t reply to your own challenge.");
  }
  if (
    existing.opponentProfileId &&
    existing.opponentProfileId !== input.responderProfileId
  ) {
    throw new Error("Only the named opponent can reply to this challenge.");
  }
  if (existing.status !== "pending" && existing.status !== "negotiating") {
    throw new Error("This challenge is already closed for replies.");
  }
  if (input.status === "negotiating" && !input.counterTerms?.trim()) {
    throw new Error("Add counter-terms before negotiating.");
  }

  const [updated] = await getDb()
    .update(challenges)
    .set({
      status: input.status,
      counterTerms:
        input.status === "negotiating"
          ? input.counterTerms!.trim()
          : existing.counterTerms,
      opponentProfileId: input.responderProfileId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(challenges.publicId, input.publicId),
        or(eq(challenges.status, "pending"), eq(challenges.status, "negotiating")),
      ),
    )
    .returning();
  return updated;
}
