import { getDbChallengeByPublicId, mapDbChallenge } from "@/lib/challenges-db";
import { getChallenge, getFighter } from "@/lib/data";
import { getProfileById, getProfileBySlug } from "@/lib/profiles";
import type { Challenge } from "@/lib/types";

export type ChallengeShareCard = {
  challenge: Challenge;
  challengerName: string;
  opponentName: string;
  summary: string;
};

async function resolveName(slug: string, fallback?: string) {
  const catalog = getFighter(slug);
  if (catalog) return catalog.name;
  const profile = await getProfileBySlug(slug);
  if (profile) return profile.displayName;
  return fallback ?? slug;
}

export async function getChallengeShareCard(
  id: string,
): Promise<ChallengeShareCard | null> {
  const catalog = getChallenge(id);
  if (catalog) {
    return {
      challenge: catalog,
      challengerName: await resolveName(catalog.challengerSlug),
      opponentName: await resolveName(catalog.opponentSlug),
      summary: catalog.grievance.slice(0, 160),
    };
  }

  const dbRow = await getDbChallengeByPublicId(id);
  if (!dbRow) return null;

  const challenge = mapDbChallenge(dbRow);
  const challengerProfile = await getProfileById(dbRow.challengerId);

  return {
    challenge,
    challengerName:
      challengerProfile?.displayName ??
      (await resolveName(challenge.challengerSlug, dbRow.challengerName)),
    opponentName: await resolveName(challenge.opponentSlug),
    summary: challenge.grievance.slice(0, 160),
  };
}
