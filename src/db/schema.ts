import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const challengeStatusEnum = pgEnum("challenge_status", [
  "pending",
  "negotiating",
  "accepted",
  "scheduled",
  "live",
  "completed",
  "declined",
]);

export const accessEnum = pgEnum("access_type", ["ppv", "free"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 128 }).notNull().unique(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  city: varchar("city", { length: 120 }).notNull().default(""),
  bio: text("bio").notNull().default(""),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const challenges = pgTable("challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicId: varchar("public_id", { length: 32 }).notNull().unique(),
  challengerId: uuid("challenger_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  opponentSlug: varchar("opponent_slug", { length: 140 }).notNull(),
  opponentProfileId: uuid("opponent_profile_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  discipline: varchar("discipline", { length: 64 }).notNull(),
  weightClass: varchar("weight_class", { length: 64 }).notNull(),
  rounds: varchar("rounds", { length: 64 }).notNull(),
  status: challengeStatusEnum("status").notNull().default("pending"),
  grievance: text("grievance").notNull(),
  terms: text("terms").notNull(),
  counterTerms: text("counter_terms"),
  venueSlug: varchar("venue_slug", { length: 140 }),
  eventDate: timestamp("event_date", { withTimezone: true }),
  access: accessEnum("access").default("free"),
  price: integer("price"),
  result: text("result"),
  issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type DbChallenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;
