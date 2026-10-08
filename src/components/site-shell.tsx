"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { AgeGate } from "./age-gate";
import { IconFeed, IconHome, IconPlay, IconPlus, IconUser } from "./icons";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const nav = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/challenges", label: "Feed", icon: IconFeed },
  { href: "/challenges/new", label: "Drop", icon: IconPlus, emphasize: true },
  { href: "/watch", label: "Live", icon: IconPlay },
  { href: "/join", label: "You", icon: IconUser },
];

function AuthControls() {
  if (!clerkEnabled) {
    return (
      <Link href="/join" className="btn btn-ghost btn-sm">
        Set up auth
      </Link>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className="btn btn-ghost btn-sm">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" className="btn btn-solid btn-sm">
            Join
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Link href="/challenges/new" className="btn btn-solid btn-sm hide-mobile">
          Drop a challenge
        </Link>
        <UserButton />
      </Show>
    </>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="site">
      <AgeGate />
      <header className="site-header">
        <Link href="/" className="brand">
          TRICOMBA
        </Link>
        <nav className="desk-nav" aria-label="Primary">
          <Link href="/challenges">Feed</Link>
          <Link href="/watch">Live</Link>
          <Link href="/gyms">Gyms</Link>
          <Link href="/rules">Rules</Link>
        </nav>
        <div className="header-actions">
          <AuthControls />
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div>
          <p className="brand-word">TRICOMBA</p>
          <p>Trial by combat, for real. Mutual consent. Licensed rooms.</p>
        </div>
        <div className="footer-links">
          <Link href="/rules">Rules</Link>
          <Link href="/gyms">Gyms</Link>
          <Link href="/watch">Live</Link>
          <Link href="/join">Join</Link>
        </div>
        <p className="fine-print">
          18+ only. TRICOMBA does not arrange street fights. Matches require mutual acceptance and
          take place in partnered, regulated combat-sport facilities.
        </p>
      </footer>
      <nav className="mobile-nav" aria-label="Mobile">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${active ? "active" : ""} ${item.emphasize ? "emphasize" : ""}`}
            >
              <span className="nav-icon">
                <Icon className="h-5 w-5" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
