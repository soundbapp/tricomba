"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { respondChallengeAction } from "@/app/actions/challenges";
import type { ChallengeStatus } from "@/lib/types";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function ChallengeActions({
  publicId,
  initialStatus,
  canRespond,
}: {
  publicId: string;
  initialStatus: ChallengeStatus;
  canRespond: boolean;
}) {
  if (!clerkEnabled) {
    return (
      <ChallengeActionsBody
        publicId={publicId}
        initialStatus={initialStatus}
        canRespond={canRespond}
        isSignedIn={false}
        authRequired={false}
      />
    );
  }
  return (
    <ChallengeActionsAuthed
      publicId={publicId}
      initialStatus={initialStatus}
      canRespond={canRespond}
    />
  );
}

function ChallengeActionsAuthed(props: {
  publicId: string;
  initialStatus: ChallengeStatus;
  canRespond: boolean;
}) {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return (
      <ChallengeActionsBody
        {...props}
        isSignedIn={false}
        authRequired={false}
      />
    );
  }
  return (
    <ChallengeActionsBody
      {...props}
      isSignedIn={Boolean(user)}
      authRequired
    />
  );
}

function ChallengeActionsBody({
  publicId,
  initialStatus,
  canRespond,
  isSignedIn,
  authRequired,
}: {
  publicId: string;
  initialStatus: ChallengeStatus;
  canRespond: boolean;
  isSignedIn: boolean;
  authRequired: boolean;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (!canRespond || status === "declined" || status === "completed" || status === "accepted") {
    return (
      <p className="action-note">
        {status === "declined"
          ? "Passed. They can drop a new challenge with different terms."
          : status === "accepted"
            ? "It’s on. A partnered gym will handle medicals, weigh-ins, and the official."
            : status === "completed"
              ? "This one is done."
              : "Only two yeses move a challenge to a gym."}
      </p>
    );
  }

  function reply(next: Extract<ChallengeStatus, "accepted" | "negotiating" | "declined">) {
    setError("");
    if (authRequired && !isSignedIn) return;
    if (next === "negotiating" && !note.trim()) {
      setError("Add counter-terms before negotiating.");
      return;
    }
    startTransition(async () => {
      const result = await respondChallengeAction({
        publicId,
        status: next,
        counterTerms: next === "negotiating" ? note : undefined,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStatus(result.status);
    });
  }

  return (
    <div className="challenge-actions">
      <p className="kicker">Reply</p>
      {authRequired && !isSignedIn ? (
        <p className="action-note">
          <Link href="/sign-in" className="text-link">
            Sign in
          </Link>{" "}
          to accept, talk terms, or pass. You can’t reply to a challenge you issued.
        </p>
      ) : (
        <>
          <label>
            Counter-terms
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Different rounds, gloves, or gym — required to talk terms."
            />
          </label>
          <div className="action-row">
            <button
              type="button"
              className="btn btn-solid"
              disabled={pending}
              onClick={() => reply("accepted")}
            >
              Accept
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={pending}
              onClick={() => reply("negotiating")}
            >
              Talk terms
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={pending}
              onClick={() => reply("declined")}
            >
              Pass
            </button>
          </div>
        </>
      )}
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
