import { fighters } from "@/lib/data";
import { searchProfiles } from "@/lib/profiles";

export type OpponentOption = {
  slug: string;
  name: string;
  city: string;
  meta: string;
  kind: "catalog" | "member";
};

export async function searchOpponents(
  query: string,
  options?: { excludeClerkId?: string; excludeSlug?: string },
): Promise<OpponentOption[]> {
  const q = query.trim().toLowerCase();
  const catalog = fighters
    .filter((fighter) => {
      if (options?.excludeSlug && fighter.slug === options.excludeSlug) return false;
      if (!q) return true;
      return (
        fighter.name.toLowerCase().includes(q) ||
        fighter.slug.includes(q) ||
        fighter.city.toLowerCase().includes(q) ||
        fighter.discipline.toLowerCase().includes(q)
      );
    })
    .slice(0, 12)
    .map((fighter) => ({
      slug: fighter.slug,
      name: fighter.name,
      city: fighter.city,
      meta: `${fighter.discipline} · Public card`,
      kind: "catalog" as const,
    }));

  if (!q) return catalog;

  const members = await searchProfiles(query, options?.excludeClerkId);
  const memberOptions = members
    .filter((profile) => !catalog.some((item) => item.slug === profile.slug))
    .map((profile) => ({
      slug: profile.slug,
      name: profile.displayName,
      city: profile.city || "Unknown",
      meta: "Member",
      kind: "member" as const,
    }));

  return [...memberOptions, ...catalog].slice(0, 16);
}
