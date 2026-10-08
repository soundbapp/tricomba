"use client";

import { useRouter } from "next/navigation";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { issueChallengeAction } from "@/app/actions/challenges";
import { searchOpponentsAction } from "@/app/actions/opponents";
import { fighters } from "@/lib/data";
import type { OpponentOption } from "@/lib/opponents";
import { disciplines, weightClasses } from "@/lib/types";

const steps = ["Opponent", "Discipline", "Terms", "Grievance"] as const;
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const defaultOpponents: OpponentOption[] = fighters.slice(0, 12).map((fighter) => ({
  slug: fighter.slug,
  name: fighter.name,
  city: fighter.city,
  meta: `${fighter.discipline} · Public card`,
  kind: "catalog",
}));

export function IssueForm() {
  if (!clerkEnabled) {
    return <IssueFormBody isSignedIn={false} authRequired={false} />;
  }
  return <IssueFormAuthed />;
}

function IssueFormAuthed() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <p className="action-note">Checking your session…</p>;
  }
  return <IssueFormBody isSignedIn={Boolean(user)} authRequired />;
}

function IssueFormBody({
  isSignedIn,
  authRequired,
}: {
  isSignedIn: boolean;
  authRequired: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [searching, startSearch] = useTransition();
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<OpponentOption[]>(defaultOpponents);
  const [opponentSlug, setOpponentSlug] = useState(fighters[1]?.slug ?? "");
  const [opponentLabel, setOpponentLabel] = useState(fighters[1]?.name ?? "Opponent");
  const [discipline, setDiscipline] = useState<(typeof disciplines)[number]>("Boxing");
  const [weightClass, setWeightClass] = useState<(typeof weightClasses)[number]>("Welterweight");
  const [rounds, setRounds] = useState("6 x 3:00");
  const [terms, setTerms] = useState(
    "Licensed referee, pre-bout medicals, approved gloves, and a partnered gym.",
  );
  const [grievance, setGrievance] = useState("");

  useEffect(() => {
    let active = true;
    startSearch(async () => {
      const next = await searchOpponentsAction(deferredQuery);
      if (active) setResults(next.length ? next : defaultOpponents);
    });
    return () => {
      active = false;
    };
  }, [deferredQuery]);

  const selected = useMemo(
    () => results.find((item) => item.slug === opponentSlug),
    [opponentSlug, results],
  );

  function next() {
    if (step === 0 && !opponentSlug) {
      setError("Pick an opponent first.");
      return;
    }
    setError("");
    setStep((value) => Math.min(value + 1, steps.length - 1));
  }

  function back() {
    setError("");
    setStep((value) => Math.max(value - 1, 0));
  }

  function submit() {
    setError("");
    if (authRequired && !isSignedIn) {
      router.push("/sign-in?redirect_url=/challenges/new");
      return;
    }

    const formData = new FormData();
    formData.set("opponentSlug", opponentSlug);
    formData.set("discipline", discipline);
    formData.set("weightClass", weightClass);
    formData.set("rounds", rounds);
    formData.set("terms", terms);
    formData.set(
      "grievance",
      grievance.trim() ||
        "A formal challenge has been issued. The grievance will be published with the card.",
    );

    startTransition(async () => {
      const result = await issueChallengeAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/challenges/${result.id}`);
    });
  }

  return (
    <div className="issue-form">
      {authRequired && !isSignedIn ? (
        <p className="action-note">
          <Link href="/sign-in" className="text-link">
            Sign in
          </Link>{" "}
          to drop a challenge that persists to the database.
        </p>
      ) : null}
      {!authRequired ? (
        <p className="action-note">
          Add Clerk + DATABASE_URL in `.env.local` to persist challenges. Dropping will report a
          clear setup error until then.
        </p>
      ) : null}

      <ol className="issue-steps">
        {steps.map((label, index) => (
          <li key={label} className={index === step ? "current" : index < step ? "done" : ""}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <fieldset>
          <legend>Nominate an opponent</legend>
          <p>Search the public card or any member by name, city, or handle.</p>
          <label>
            Search
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, city, or @slug"
              autoComplete="off"
            />
          </label>
          {searching ? <p className="action-note">Searching…</p> : null}
          <div className="choice-grid">
            {results.map((option) => (
              <button
                key={`${option.kind}-${option.slug}`}
                type="button"
                className={`choice ${opponentSlug === option.slug ? "selected" : ""}`}
                onClick={() => {
                  setOpponentSlug(option.slug);
                  setOpponentLabel(option.name);
                  setError("");
                }}
              >
                <strong>{option.name}</strong>
                <span>
                  {option.city} · {option.meta}
                </span>
              </button>
            ))}
          </div>
          {opponentSlug ? (
            <p className="action-note" style={{ marginTop: "0.75rem" }}>
              Selected: <strong>{selected?.name ?? opponentLabel}</strong>
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {step === 1 ? (
        <fieldset>
          <legend>Choose the contest</legend>
          <label>
            Discipline
            <select
              value={discipline}
              onChange={(event) =>
                setDiscipline(event.target.value as (typeof disciplines)[number])
              }
            >
              {disciplines.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Weight class
            <select
              value={weightClass}
              onChange={(event) =>
                setWeightClass(event.target.value as (typeof weightClasses)[number])
              }
            >
              {weightClasses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset>
          <legend>Set the terms</legend>
          <label>
            Rounds
            <input value={rounds} onChange={(event) => setRounds(event.target.value)} />
          </label>
          <label>
            Rules of the room
            <textarea
              rows={4}
              value={terms}
              onChange={(event) => setTerms(event.target.value)}
            />
          </label>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <fieldset>
          <legend>State the grievance</legend>
          <p>
            This is the public reason. Be specific. TRICOMBA publishes the beef with the bout — not
            private messages.
          </p>
          <label>
            The score to settle
            <textarea
              rows={5}
              value={grievance}
              onChange={(event) => setGrievance(event.target.value)}
              placeholder="What was said, done, or stolen — and why it belongs in a ring."
            />
          </label>
          <div className="issue-review">
            <p>
              <strong>{selected?.name ?? opponentLabel}</strong> · {discipline} · {weightClass}
            </p>
            <p>{rounds}</p>
          </div>
        </fieldset>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}

      <div className="issue-actions">
        {step > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={back}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button type="button" className="btn btn-solid" onClick={next}>
            Continue
          </button>
        ) : (
          <button type="button" className="btn btn-solid" onClick={submit} disabled={pending}>
            {pending ? "Dropping…" : "Drop the challenge"}
          </button>
        )}
      </div>
    </div>
  );
}
