"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { hasDatabase } from "@/db";
import { createChallenge, respondToChallenge } from "@/lib/challenges-db";
import { ensureProfile, getProfileByClerkId } from "@/lib/profiles";
import { disciplines, weightClasses, type ChallengeStatus } from "@/lib/types";

export async function issueChallengeAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Sign in to drop a challenge." };
  }
  if (!hasDatabase()) {
    return {
      ok: false as const,
      error: "Database is not configured yet. Add DATABASE_URL to .env.local.",
    };
  }

  const user = await currentUser();
  if (!user) return { ok: false as const, error: "Could not load your user." };

  const profile = await ensureProfile(user);
  if (!profile) return { ok: false as const, error: "Could not create your profile." };

  const opponentSlug = String(formData.get("opponentSlug") ?? "");
  const discipline = String(formData.get("discipline") ?? "");
  const weightClass = String(formData.get("weightClass") ?? "");
  const rounds = String(formData.get("rounds") ?? "").trim();
  const terms = String(formData.get("terms") ?? "").trim();
  const grievance = String(formData.get("grievance") ?? "").trim();

  if (!opponentSlug || !rounds || !terms || !grievance) {
    return { ok: false as const, error: "Fill every step before dropping." };
  }
  if (!disciplines.includes(discipline as (typeof disciplines)[number])) {
    return { ok: false as const, error: "Pick a valid discipline." };
  }
  if (!weightClasses.includes(weightClass as (typeof weightClasses)[number])) {
    return { ok: false as const, error: "Pick a valid weight class." };
  }

  try {
    const created = await createChallenge({
      challengerId: profile.id,
      challengerSlug: profile.slug,
      opponentSlug,
      discipline,
      weightClass,
      rounds,
      terms,
      grievance,
    });
    revalidatePath("/challenges");
    revalidatePath("/join");
    revalidatePath("/");
    return { ok: true as const, id: created.publicId };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Could not create challenge.",
    };
  }
}

export async function respondChallengeAction(input: {
  publicId: string;
  status: Extract<ChallengeStatus, "accepted" | "negotiating" | "declined">;
  counterTerms?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Sign in to reply." };
  }
  if (!hasDatabase()) {
    return { ok: false as const, error: "Database is not configured yet." };
  }

  const profile = await getProfileByClerkId(userId);
  if (!profile) {
    return { ok: false as const, error: "Finish your profile first." };
  }

  try {
    const updated = await respondToChallenge({
      ...input,
      responderProfileId: profile.id,
    });
    if (!updated) {
      return {
        ok: false as const,
        error: "Challenge not found in the database. Drop a new one while signed in.",
      };
    }
    revalidatePath(`/challenges/${input.publicId}`);
    revalidatePath("/challenges");
    revalidatePath("/join");
    revalidatePath("/");
    return { ok: true as const, status: updated.status };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Could not update challenge.",
    };
  }
}
