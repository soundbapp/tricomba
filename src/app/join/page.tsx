import { auth } from "@clerk/nextjs/server";
import { JoinPanel } from "@/components/join-panel";
import { listChallengesForProfile, mapDbChallenge } from "@/lib/challenges-db";
import { getFighter } from "@/lib/data";
import { getProfileByClerkId } from "@/lib/profiles";

export default async function JoinPage() {
  const { userId } = await auth();
  const profile = userId ? await getProfileByClerkId(userId) : null;

  const desk = profile
    ? (await listChallengesForProfile({ profileId: profile.id, slug: profile.slug })).map(
        (row) => {
          const challenge = mapDbChallenge(row);
          const issued = row.challengerId === profile.id;
          const otherSlug = issued ? row.opponentSlug : row.challengerSlug;
          const other =
            getFighter(otherSlug)?.name ??
            (issued ? otherSlug : row.challengerName);
          return {
            ...challenge,
            role: issued ? ("issued" as const) : ("received" as const),
            otherName: other,
          };
        },
      )
    : [];

  return (
    <div className="page-pad">
      <p className="kicker">You</p>
      <h1>Make your name</h1>
      <p className="lede">
        Trial by combat starts with a name. You’re 18+, and any bout you accept happens under rules
        in a partnered gym.
      </p>
      <JoinPanel
        profile={
          profile
            ? {
                displayName: profile.displayName,
                city: profile.city,
                slug: profile.slug,
              }
            : null
        }
        challenges={desk}
      />
    </div>
  );
}
