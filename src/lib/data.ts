import type { Challenge, Fighter, Gym } from "./types";

function fighterPhoto(slug: string) {
  return `/images/fighters/${slug}.jpg`;
}

function gymPhoto(slug: string) {
  return `/images/gyms/${slug}.jpg`;
}

export const fighters: Fighter[] = [
  {
    slug: "mara-voss",
    name: "Mara Voss",
    moniker: "The Verdict",
    record: "14-1-0",
    city: "Brooklyn",
    discipline: "Boxing",
    weightClass: "Lightweight",
    bio: "Former amateur national champion who left commentary to settle scores she used to narrate. Precision over power. Never misses a presser.",
    initials: "MV",
    palette: { from: "#3b1014", via: "#0b0706", to: "#8a6a1a" },
    image: fighterPhoto("mara-voss"),
    verified: true,
  },
  {
    slug: "julian-crowe",
    name: "Julian Crowe",
    moniker: "Crowbar",
    record: "11-3-0",
    city: "Las Vegas",
    discipline: "MMA",
    weightClass: "Welterweight",
    bio: "Gym owner, clip machine, and the man who said a rival's title was purchased. He posted the challenge before the apology.",
    initials: "JC",
    palette: { from: "#1a2030", via: "#08090c", to: "#6b1d1d" },
    image: fighterPhoto("julian-crowe"),
    verified: true,
  },
  {
    slug: "asha-okonkwo",
    name: "Asha Okonkwo",
    moniker: "Redline",
    record: "22-2-0",
    city: "London",
    discipline: "Kickboxing",
    weightClass: "Featherweight",
    bio: "Southpaw technician. Turned a leaked training tape into a public dare. Wants the bout under full Glory-style rules.",
    initials: "AO",
    palette: { from: "#4a140c", via: "#0c0806", to: "#2a4a3a" },
    image: fighterPhoto("asha-okonkwo"),
    verified: true,
  },
  {
    slug: "cole-brennan",
    name: "Cole Brennan",
    record: "9-0-0",
    city: "Chicago",
    discipline: "Wrestling",
    weightClass: "Heavyweight",
    bio: "Collegiate All-American who claims a promoter buried his contract. Wants it settled on the mat, not in court filings.",
    initials: "CB",
    palette: { from: "#1c2430", via: "#090b0e", to: "#7a5a20" },
    image: fighterPhoto("cole-brennan"),
    verified: false,
  },
  {
    slug: "ivy-tan",
    name: "Ivy Tan",
    moniker: "Lockjaw",
    record: "16-4-0",
    city: "Miami",
    discipline: "BJJ",
    weightClass: "Bantamweight",
    bio: "Black belt, academy owner, and the quiet end of every argument that starts online. Prefers gi. Will accept no-gi if the grievance is real.",
    initials: "IT",
    palette: { from: "#142028", via: "#07080a", to: "#3a5a58" },
    image: fighterPhoto("ivy-tan"),
    verified: true,
  },
  {
    slug: "nico-alvarez",
    name: "Nico Alvarez",
    moniker: "Night Train",
    record: "18-2-1",
    city: "Mexico City",
    discipline: "Boxing",
    weightClass: "Middleweight",
    bio: "Pressure fighter with a late-night following. Issued a challenge after a podcast called his last win a gift.",
    initials: "NA",
    palette: { from: "#2a1020", via: "#080606", to: "#8a3a14" },
    image: fighterPhoto("nico-alvarez"),
    verified: true,
  },
  {
    slug: "soren-hale",
    name: "Soren Hale",
    record: "8-1-0",
    city: "Stockholm",
    discipline: "MMA",
    weightClass: "Light Heavyweight",
    bio: "Quiet, decorated, and newly public. Challenged a rival coach after a camp walkout went viral.",
    initials: "SH",
    palette: { from: "#102028", via: "#07090c", to: "#4a3a20" },
    image: fighterPhoto("soren-hale"),
    verified: false,
  },
  {
    slug: "rhea-quintana",
    name: "Rhea Quintana",
    moniker: "Saint Rhea",
    record: "19-3-0",
    city: "Los Angeles",
    discipline: "Muay Thai",
    weightClass: "Lightweight",
    bio: "Clinician of the clinch. Does not do interviews. Does accept formal challenges when the insult is specific.",
    initials: "RQ",
    palette: { from: "#3a1028", via: "#0a0708", to: "#8a5a20" },
    image: fighterPhoto("rhea-quintana"),
    verified: true,
  },
  {
    slug: "ezra-kane",
    name: "Ezra Kane",
    moniker: "The Deed",
    record: "12-5-0",
    city: "Detroit",
    discipline: "Boxing",
    weightClass: "Heavyweight",
    bio: "Club-circuit finisher with a public feud over a stolen corner man. Wants ten rounds or nothing.",
    initials: "EK",
    palette: { from: "#201010", via: "#080606", to: "#5a3a10" },
    image: fighterPhoto("ezra-kane"),
    verified: true,
  },
  {
    slug: "lina-moreau",
    name: "Lina Moreau",
    record: "7-0-0",
    city: "Paris",
    discipline: "Wrestling",
    weightClass: "Middleweight",
    bio: "National team wrestler who challenged a commentator after a broadcast mocked her weight cut. Folkstyle or freestyle — her choice.",
    initials: "LM",
    palette: { from: "#201418", via: "#0a0809", to: "#6a4a2a" },
    image: fighterPhoto("lina-moreau"),
    verified: false,
  },
];

export const gyms: Gym[] = [
  {
    slug: "iron-law",
    name: "Iron Law Athletic Club",
    city: "Brooklyn",
    country: "USA",
    disciplines: ["Boxing", "MMA"],
    note: "Commission-ready ring, ringside physician on call, and a 200-seat loft for ticketed cards.",
    image: gymPhoto("iron-law"),
  },
  {
    slug: "red-hour",
    name: "Red Hour Gym",
    city: "Las Vegas",
    country: "USA",
    disciplines: ["MMA", "Wrestling", "BJJ"],
    note: "Cage, mats, and licensed officials. Handles medicals and weigh-ins for desert-card events.",
    image: gymPhoto("red-hour"),
  },
  {
    slug: "southpaw-society",
    name: "Southpaw Society",
    city: "London",
    country: "UK",
    disciplines: ["Boxing", "Kickboxing", "Muay Thai"],
    note: "British-style gloves-on club shows with a licensed referee and pre-bout medicals.",
    image: gymPhoto("southpaw-society"),
  },
  {
    slug: "crown-canvas",
    name: "Crown & Canvas",
    city: "Miami",
    country: "USA",
    disciplines: ["BJJ", "Wrestling", "MMA"],
    note: "Academy that hosts sanctioned exhibitions. Prefers technical rulesets and full insurance.",
    image: gymPhoto("crown-canvas"),
  },
  {
    slug: "hourglass",
    name: "Hourglass Combat",
    city: "Los Angeles",
    country: "USA",
    disciplines: ["Muay Thai", "Kickboxing", "Boxing"],
    note: "Thai-rules ring, cutman, and a live-stream booth. Partnerships with local athletic commissions.",
    image: gymPhoto("hourglass"),
  },
];

export const challenges: Challenge[] = [
  {
    id: "tc-1841",
    challengerSlug: "mara-voss",
    opponentSlug: "nico-alvarez",
    discipline: "Boxing",
    weightClass: "Middleweight",
    rounds: "8 x 3:00",
    status: "live",
    grievance:
      "Alvarez told a late-night show that Voss's last title shot was a courtesy booking. She issued a formal challenge before the clip finished trending.",
    terms: "8 rounds, 10oz gloves, three knockdowns, ringside physician, licensed referee.",
    issuedAt: "2026-09-12T18:20:00.000Z",
    venueSlug: "iron-law",
    eventDate: "2026-10-03T22:00:00.000Z",
    access: "ppv",
    price: 19,
  },
  {
    id: "tc-1833",
    challengerSlug: "julian-crowe",
    opponentSlug: "soren-hale",
    discipline: "MMA",
    weightClass: "Light Heavyweight",
    rounds: "3 x 5:00",
    status: "scheduled",
    grievance:
      "Hale walked out of Crowe's camp and called the gym a content mill. Crowe wants it settled in a cage, under unified rules.",
    terms: "Unified MMA rules, 3 rounds, 5 minutes, athletic-commission medicals, no elbows to the back of the head.",
    issuedAt: "2026-08-28T14:05:00.000Z",
    venueSlug: "red-hour",
    eventDate: "2026-10-18T02:00:00.000Z",
    access: "ppv",
    price: 29,
  },
  {
    id: "tc-1820",
    challengerSlug: "asha-okonkwo",
    opponentSlug: "rhea-quintana",
    discipline: "Kickboxing",
    weightClass: "Lightweight",
    rounds: "5 x 3:00",
    status: "accepted",
    grievance:
      "A leaked sparring tape was posted with a caption calling Okonkwo finished. Quintana did not post it. She accepted the challenge anyway.",
    terms: "Oriental kickboxing rules, shin guards optional, clinch limited to two seconds.",
    issuedAt: "2026-09-02T09:40:00.000Z",
    venueSlug: "hourglass",
    access: "free",
  },
  {
    id: "tc-1811",
    challengerSlug: "ivy-tan",
    opponentSlug: "lina-moreau",
    discipline: "BJJ",
    weightClass: "Middleweight",
    rounds: "1 x 10:00",
    status: "negotiating",
    grievance:
      "Moreau said Tan's academy sells belts. Tan wants ten minutes, ibjjf points, and a public scoreboard.",
    terms: "Gi or no-gi still under negotiation. Winner by points, advantage, or submission.",
    issuedAt: "2026-09-22T16:11:00.000Z",
  },
  {
    id: "tc-1804",
    challengerSlug: "cole-brennan",
    opponentSlug: "ezra-kane",
    discipline: "Wrestling",
    weightClass: "Heavyweight",
    rounds: "2 x 3:00",
    status: "pending",
    grievance:
      "Kane hired Brennan's corner man the week of a club show. Brennan wants a folkstyle match and the corner back if he wins.",
    terms: "Folkstyle, college scoring, no slamming, licensed official.",
    issuedAt: "2026-09-29T21:00:00.000Z",
  },
  {
    id: "tc-1790",
    challengerSlug: "rhea-quintana",
    opponentSlug: "asha-okonkwo",
    discipline: "Muay Thai",
    weightClass: "Lightweight",
    rounds: "5 x 3:00",
    status: "completed",
    grievance:
      "The first meeting was kickboxing. Quintana wanted Thai rules for the rematch: elbows, clinch, and a real score.",
    terms: "Full Muay Thai rules, 8oz gloves, elbows legal, three-knockdown stoppage.",
    issuedAt: "2026-06-04T19:00:00.000Z",
    venueSlug: "southpaw-society",
    eventDate: "2026-07-19T19:30:00.000Z",
    access: "free",
    result: "Quintana by unanimous decision",
  },
  {
    id: "tc-1776",
    challengerSlug: "nico-alvarez",
    opponentSlug: "julian-crowe",
    discipline: "Boxing",
    weightClass: "Welterweight",
    rounds: "6 x 3:00",
    status: "declined",
    grievance:
      "Crowe called Alvarez a club fighter on a stream. Alvarez proposed boxing. Crowe declined and offered MMA instead.",
    terms: "Declined as boxed. Still open if restated as MMA.",
    issuedAt: "2026-07-11T11:22:00.000Z",
  },
  {
    id: "tc-1762",
    challengerSlug: "ezra-kane",
    opponentSlug: "cole-brennan",
    discipline: "Boxing",
    weightClass: "Heavyweight",
    rounds: "6 x 3:00",
    status: "scheduled",
    grievance:
      "If Brennan wants the corner, Kane wants him in gloves first. A wrestling match is still pending. This one is booked.",
    terms: "6 rounds, 10oz, open scoring, exhibition under club commission rules.",
    issuedAt: "2026-08-02T08:15:00.000Z",
    venueSlug: "iron-law",
    eventDate: "2026-11-01T23:00:00.000Z",
    access: "free",
  },
];

export function getFighter(slug: string) {
  return fighters.find((fighter) => fighter.slug === slug);
}

export function getGym(slug: string) {
  return gyms.find((gym) => gym.slug === slug);
}

export function getChallenge(id: string) {
  return challenges.find((challenge) => challenge.id === id);
}

export function challengesForFighter(slug: string) {
  return challenges.filter(
    (challenge) =>
      challenge.challengerSlug === slug || challenge.opponentSlug === slug,
  );
}

export const featuredChallengeId = "tc-1841";

export const watchable = challenges.filter(
  (challenge) =>
    challenge.status === "live" ||
    challenge.status === "scheduled" ||
    challenge.status === "completed",
);
