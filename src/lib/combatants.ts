import type { Profile } from "@/db/schema";
import {
  challenges as catalogChallenges,
  fighters,
  getFighter,
} from "@/lib/data";
import {
  listDbChallenges,
  mapDbChallenge,
  type ChallengeWithChallenger,
} from "@/lib/challenges-db";
import { getProfileById } from "@/lib/profiles";
import type { Challenge, Fighter } from "@/lib/types";

export function fighterFromProfile(profile: Profile): Fighter {
  return {
    slug: profile.slug,
    name: profile.displayName,
    record: "0-0-0",
    city: profile.city || "Unknown",
    discipline: "Boxing",
    weightClass: "Open",
    bio: profile.bio || "New to the card.",
    initials:
      profile.displayName
        .split(" ")
        .map((part) => part[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase() || "TC",
    palette: { from: "#1a1014", via: "#0b0706", to: "#6a2a2a" },
    image: profile.imageUrl || "/images/fighters/mara-voss.jpg",
    verified: true,
  };
}

export function resolveFighter(slug: string, extras: Fighter[] = []) {
  return getFighter(slug) ?? extras.find((fighter) => fighter.slug === slug);
}

export async function getMergedChallenges(): Promise<{
  challenges: Challenge[];
  combatants: Fighter[];
}> {
  const profileFighters: Fighter[] = [];
  const dbRows = await listDbChallenges();

  for (const row of dbRows) {
    if (!resolveFighter(row.challengerSlug, profileFighters)) {
      const profile = await getProfileById(row.challengerId);
      if (profile) profileFighters.push(fighterFromProfile(profile));
    }
  }

  const mapped = dbRows.map((row: ChallengeWithChallenger) => mapDbChallenge(row));
  const byId = new Map<string, Challenge>();
  for (const item of mapped) byId.set(item.id, item);
  for (const item of catalogChallenges) {
    if (!byId.has(item.id)) byId.set(item.id, item);
  }

  return {
    challenges: [...byId.values()].sort(
      (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime(),
    ),
    combatants: [...fighters, ...profileFighters],
  };
}
