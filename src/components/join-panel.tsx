"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { completeProfileAction } from "@/app/actions/profile";
import type { Challenge } from "@/lib/types";
import { StatusMark } from "./ui";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

type DeskChallenge = Challenge & {
  role: "issued" | "received";
  otherName: string;
};

export function JoinPanel({
  profile,
  challenges,
}: {
  profile: { displayName: string; city: string; slug: string } | null;
  challenges: DeskChallenge[];
}) {
  if (!clerkEnabled) {
    return (
      <>
        <p className="action-note">
          Clerk keys are not configured yet. Add them to `.env.local` to persist profiles.
        </p>
        <ProfileForm defaultName="" defaultCity="" persist={false} />
      </>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <div className="detail-panel" style={{ margin: "1rem 0" }}>
          <p className="kicker">Account required</p>
          <h2>Sign in to claim your name</h2>
          <p className="lede">Your profile syncs from Clerk into Postgres.</p>
          <div className="hero-actions">
            <SignInButton mode="modal">
              <button type="button" className="btn btn-solid">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button type="button" className="btn btn-ghost">
                Create account
              </button>
            </SignUpButton>
          </div>
        </div>
      </Show>
      <Show when="signed-in">
        <JoinSignedIn profile={profile} challenges={challenges} />
      </Show>
    </>
  );
}

function JoinSignedIn({
  profile,
  challenges,
}: {
  profile: { displayName: string; city: string; slug: string } | null;
  challenges: DeskChallenge[];
}) {
  const { user } = useUser();

  if (profile) {
    return (
      <>
        <section className="detail-panel" style={{ margin: "1rem 0" }}>
          <p className="kicker">You’re in</p>
          <h2>{profile.displayName}</h2>
          <p>
            {profile.city ? `${profile.city} · ` : ""}
            @{profile.slug}
          </p>
          <div className="hero-actions">
            <Link href="/challenges/new" className="btn btn-solid">
              Drop a challenge
            </Link>
            <Link href="/challenges" className="btn btn-ghost">
              Open the feed
            </Link>
          </div>
        </section>
        <MyChallenges challenges={challenges} />
      </>
    );
  }

  return (
    <ProfileForm
      defaultName={user?.fullName ?? ""}
      defaultCity=""
      persist
    />
  );
}

function MyChallenges({ challenges }: { challenges: DeskChallenge[] }) {
  return (
    <section style={{ marginTop: "1.5rem" }}>
      <p className="kicker">Your desk</p>
      <h2 style={{ margin: "0.2rem 0 0.75rem", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
        Challenges
      </h2>
      {challenges.length === 0 ? (
        <p className="action-note">
          Nothing here yet. Drop a challenge or wait for someone to tag you.
        </p>
      ) : (
        <div className="stack">
          {challenges.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.id}`}
              className="detail-panel"
              style={{ display: "block", margin: 0, textDecoration: "none", color: "inherit" }}
            >
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                <StatusMark status={challenge.status} />
                <span className="mono" style={{ color: "var(--mute)" }}>
                  {challenge.role === "issued" ? "You issued" : "You received"} · {challenge.id}
                </span>
              </div>
              <strong style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                {challenge.role === "issued" ? "vs" : "from"} {challenge.otherName}
              </strong>
              <p style={{ margin: "0.35rem 0 0", color: "var(--mute)" }}>
                {challenge.discipline} · {challenge.weightClass} · {challenge.rounds}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function ProfileForm({
  defaultName,
  defaultCity,
  persist,
}: {
  defaultName: string;
  defaultCity: string;
  persist: boolean;
}) {
  const [done, setDone] = useState(false);
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <section className="detail-panel" style={{ margin: "1rem 0" }}>
        <p className="kicker">You’re in</p>
        <h2>{name || "Name"}</h2>
        <p>Profile saved. Drop a challenge or hit the live feed.</p>
        <div className="hero-actions">
          <Link href="/challenges/new" className="btn btn-solid">
            Drop a challenge
          </Link>
          <Link href="/watch" className="btn btn-ghost">
            Watch live
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form
      className="issue-form"
      style={{ margin: "1rem 0" }}
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          if (!persist) {
            const localName = String(formData.get("displayName") ?? "");
            window.localStorage.setItem("tricomba-profile", JSON.stringify({ name: localName }));
            setName(localName);
            setDone(true);
            return;
          }
          const result = await completeProfileAction(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setName(result.profile.displayName);
          setDone(true);
          window.location.reload();
        });
      }}
    >
      <label>
        Display name
        <input
          name="displayName"
          required
          defaultValue={defaultName}
          placeholder="How you show up"
        />
      </label>
      <label>
        City
        <input name="city" required defaultValue={defaultCity} placeholder="Where you train" />
      </label>
      <label className="attest">
        <input type="checkbox" required />
        I am 18 or older and understand accepted challenges become consented combat-sport contests
        in licensed facilities.
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="btn btn-solid" disabled={pending}>
        {pending ? "Saving…" : "Save my name"}
      </button>
    </form>
  );
}
