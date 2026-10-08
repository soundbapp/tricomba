"use client";

import { useState } from "react";
import type { Challenge } from "@/lib/types";

export function WatchDesk({ challenge }: { challenge: Challenge }) {
  const [unlocked, setUnlocked] = useState(challenge.access === "free");
  const isLive = challenge.status === "live";

  return (
    <section className={`watch-desk ${isLive ? "is-live" : ""}`}>
      <div className="watch-screen">
        {unlocked ? (
          <div className="watch-live">
            <span className={isLive ? "live-dot" : "status"}>{isLive ? "LIVE" : "Replay"}</span>
            <p>{isLive ? "The room is open." : "On demand from the gym."}</p>
          </div>
        ) : (
          <div className="watch-lock">
            <p className="kicker" style={{ color: "#ff6b84" }}>
              Pay-per-view
            </p>
            <h2>${challenge.price} unlocks this</h2>
            <p>One payment. Live now, replay after.</p>
            <button type="button" className="btn btn-solid" onClick={() => setUnlocked(true)}>
              Unlock
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
