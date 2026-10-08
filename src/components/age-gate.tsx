"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tricomba-age-ok";

export function AgeGate() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(window.localStorage.getItem(STORAGE_KEY) !== "1");
    setReady(true);
  }, []);

  if (!ready || !open) return null;

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="age-gate-card">
        <p className="kicker">18+</p>
        <h2 id="age-gate-title">TRICOMBA is for adults.</h2>
        <p className="lede">
          Trial by combat means real contests in licensed gyms — not street fights. You must be 18
          or older to drop, accept, or watch.
        </p>
        <div className="age-gate-actions">
          <button
            type="button"
            className="btn btn-solid"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, "1");
              setOpen(false);
            }}
          >
            I am 18 or older
          </button>
          <a className="btn btn-ghost" href="https://www.google.com">
            Leave
          </a>
        </div>
      </div>
    </div>
  );
}
