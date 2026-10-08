import { and, eq, ilike, ne, or, type SQL } from "drizzle-orm";
import type { User } from "@clerk/nextjs/server";
import { getDb, hasDatabase } from "@/db";
import { profiles, type Profile } from "@/db/schema";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function ensureProfile(user: User): Promise<Profile | null> {
  if (!hasDatabase()) return null;
  const db = getDb();
  const [existing] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.clerkId, user.id))
    .limit(1);
  if (existing) return existing;

  const displayName =
    user.fullName?.trim() ||
    user.username ||
    user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Fighter";
  const baseSlug = slugify(displayName) || `user-${user.id.slice(-6)}`;
  let slug = baseSlug;
  let attempt = 0;
  while (attempt < 8) {
    const [clash] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.slug, slug))
      .limit(1);
    if (!clash) break;
    attempt += 1;
    slug = `${baseSlug}-${attempt + 1}`;
  }

  const [created] = await db
    .insert(profiles)
    .values({
      clerkId: user.id,
      displayName,
      slug,
      city: "",
      bio: "",
      imageUrl: user.imageUrl,
    })
    .returning();

  return created ?? null;
}

export async function getProfileByClerkId(clerkId: string) {
  if (!hasDatabase()) return null;
  const [row] = await getDb()
    .select()
    .from(profiles)
    .where(eq(profiles.clerkId, clerkId))
    .limit(1);
  return row ?? null;
}

export async function getProfileById(id: string) {
  if (!hasDatabase()) return null;
  const [row] = await getDb()
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);
  return row ?? null;
}

export async function getProfileBySlug(slug: string) {
  if (!hasDatabase()) return null;
  const [row] = await getDb()
    .select()
    .from(profiles)
    .where(eq(profiles.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function searchProfiles(query: string, excludeClerkId?: string) {
  if (!hasDatabase()) return [];
  const q = query.trim();
  if (q.length < 1) return [];

  const pattern = `%${q}%`;
  const match = or(
    ilike(profiles.displayName, pattern),
    ilike(profiles.slug, pattern),
    ilike(profiles.city, pattern),
  );
  const where: SQL | undefined = excludeClerkId
    ? and(match, ne(profiles.clerkId, excludeClerkId))
    : match;

  return getDb()
    .select({
      id: profiles.id,
      slug: profiles.slug,
      displayName: profiles.displayName,
      city: profiles.city,
    })
    .from(profiles)
    .where(where)
    .limit(12);
}

export async function updateProfile(
  clerkId: string,
  data: { displayName: string; city: string; bio?: string },
) {
  if (!hasDatabase()) {
    throw new Error("Database is not configured.");
  }
  const [updated] = await getDb()
    .update(profiles)
    .set({
      displayName: data.displayName.trim(),
      city: data.city.trim(),
      bio: data.bio?.trim() ?? "",
      updatedAt: new Date(),
    })
    .where(eq(profiles.clerkId, clerkId))
    .returning();
  return updated;
}
