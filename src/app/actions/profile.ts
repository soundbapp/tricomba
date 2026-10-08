"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ensureProfile, updateProfile } from "@/lib/profiles";
import { hasDatabase } from "@/db";

export async function completeProfileAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Sign in to create your name." };
  }
  if (!hasDatabase()) {
    return {
      ok: false as const,
      error: "Database is not configured yet. Add DATABASE_URL to .env.local.",
    };
  }

  const user = await currentUser();
  if (!user) {
    return { ok: false as const, error: "Could not load your Clerk user." };
  }

  await ensureProfile(user);

  const displayName = String(formData.get("displayName") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  if (!displayName || !city) {
    return { ok: false as const, error: "Name and city are required." };
  }

  const profile = await updateProfile(userId, { displayName, city });
  revalidatePath("/join");
  revalidatePath("/");
  return { ok: true as const, profile };
}
