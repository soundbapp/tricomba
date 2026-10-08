import type { Metadata } from "next";
import { IssueForm } from "@/components/issue-form";

export const metadata: Metadata = {
  title: "Drop a challenge",
};

export default function NewChallengePage() {
  return (
    <div className="page-pad">
      <p className="kicker">New post</p>
      <h1>Drop a challenge</h1>
      <p className="lede">
        Tag someone. Pick the sport. Say the beef out loud. They can accept, pass, or talk terms.
        Only two yeses books a gym.
      </p>
      <div style={{ marginTop: "1rem" }}>
        <IssueForm />
      </div>
    </div>
  );
}
