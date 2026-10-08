"use server";

import { auth } from "@clerk/nextjs/server";
import { searchOpponents, type OpponentOption } from "@/lib/opponents";
import { getProfileByClerkId } from "@/lib/profiles";

export async function searchOpponentsAction(query: string): Promise<OpponentOption[]> {
  const { userId } = await auth();
  const profile = userId ? await getProfileByClerkId(userId) : null;
  return searchOpponents(query, {
    excludeClerkId: userId ?? undefined,
    excludeSlug: profile?.slug,
  });
}
