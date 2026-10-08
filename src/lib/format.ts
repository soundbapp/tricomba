import type { ChallengeStatus } from "./types";

export function displayName(name: string, moniker?: string) {
  return moniker ? `${name} “${moniker}”` : name;
}

export function docketName(name: string) {
  const parts = name.trim().split(" ");
  const last = parts.pop();
  return last ? `${last}, ${parts.join(" ")}` : name;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function timeAgo(value: string) {
  const ms = Date.now() - new Date(value).getTime();
  const mins = Math.max(1, Math.floor(ms / 60000));
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return formatDate(value);
}

export const statusCopy: Record<ChallengeStatus, string> = {
  pending: "Waiting",
  negotiating: "Talking",
  accepted: "It's on",
  scheduled: "Date set",
  live: "LIVE",
  completed: "Done",
  declined: "Passed",
};
