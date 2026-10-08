export const disciplines = [
  "Boxing",
  "MMA",
  "Wrestling",
  "Kickboxing",
  "Muay Thai",
  "BJJ",
] as const;

export type Discipline = (typeof disciplines)[number];

export const weightClasses = [
  "Flyweight",
  "Bantamweight",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight",
  "Open",
] as const;

export type WeightClass = (typeof weightClasses)[number];

export const challengeStatuses = [
  "pending",
  "negotiating",
  "accepted",
  "scheduled",
  "live",
  "completed",
  "declined",
] as const;

export type ChallengeStatus = (typeof challengeStatuses)[number];

export type Access = "ppv" | "free";

export type Palette = {
  from: string;
  via: string;
  to: string;
};

export type Fighter = {
  slug: string;
  name: string;
  moniker?: string;
  record: string;
  city: string;
  discipline: Discipline;
  weightClass: WeightClass;
  bio: string;
  initials: string;
  palette: Palette;
  image: string;
  verified: boolean;
};

export type Gym = {
  slug: string;
  name: string;
  city: string;
  country: string;
  disciplines: Discipline[];
  note: string;
  image: string;
};

export type Challenge = {
  id: string;
  challengerSlug: string;
  opponentSlug: string;
  discipline: Discipline;
  weightClass: WeightClass;
  rounds: string;
  status: ChallengeStatus;
  grievance: string;
  terms: string;
  counterTerms?: string;
  issuedAt: string;
  venueSlug?: string;
  eventDate?: string;
  access?: Access;
  price?: number;
  result?: string;
};
