"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

type ShareChallengeProps = {
  title: string;
  text: string;
};

function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="share-icon">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.875 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
      />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="share-icon">
      <path
        fill="currentColor"
        d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5H16.7V4.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3V14h2.7v8h3.5z"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="share-icon">
      <path
        fill="currentColor"
        d="M6.5 8.8A2.3 2.3 0 1 1 6.5 4a2.3 2.3 0 0 1 0 4.8zM4.5 20.5h4V9.8h-4v10.7zM13 9.8h-3.8v10.7H13v-5.6c0-1.5.7-2.3 1.9-2.3 1.1 0 1.7.8 1.7 2.3v5.6h3.9v-6.1c0-3.3-1.8-4.8-4.3-4.8-1.5 0-2.6.7-3.2 1.8h-.1V9.8z"
      />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="share-icon">
      <path
        fill="currentColor"
        d="M12 3.2A8.7 8.7 0 0 0 5.3 16.7L4.2 20.7l4.1-1.1A8.7 8.7 0 1 0 12 3.2zm4.9 12.3c-.2.6-1.2 1.1-1.9 1.2-.5.1-1.1.2-3.6-.8-3.1-1.2-5.1-4.2-5.3-4.4-.2-.2-1.5-2-1.5-3.8s1-2.7 1.3-3.1c.3-.3.7-.4 1-.4h.7c.2 0 .5 0 .7.5.2.6.8 2.1.9 2.2.1.2.1.4 0 .6-.1.2-.2.4-.3.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.1.5.2.6.3.1.2.1.9-.1 1.5z"
      />
    </svg>
  );
}

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="share-icon">
      <path
        fill="currentColor"
        d="M21.5 4.3 3.9 11c-1.2.5-1.2 1.1-.2 1.4l4.5 1.4 1.7 5.3c.2.7.4 1 .9 1 .5 0 .7-.2 1-.6l2.5-3.8 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.5z"
      />
    </svg>
  );
}

function IconReddit() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="share-icon">
      <path
        fill="currentColor"
        d="M14.2 3.4c.2.8.4 1.5.5 2.2 1.7.1 3.2.7 4.3 1.7.5-.3 1.1-.4 1.7-.4 1.5 0 2.7 1.2 2.7 2.7 0 1.1-.7 2.1-1.7 2.5.1.5.2 1 .2 1.6 0 3.6-3.9 6.5-8.7 6.5S4.5 17.3 4.5 13.7c0-.5.1-1.1.2-1.6A2.7 2.7 0 0 1 3 9.6c0-1.5 1.2-2.7 2.7-2.7.6 0 1.2.2 1.7.4 1.1-1 2.6-1.6 4.3-1.7.2-.9.4-1.7.7-2.5.2-.4.6-.6 1-.5l3.1.8c.4.1.7.5.6.9s-.5.7-.9.6l-1.9-.5zM8.8 12.2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm6.4 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm-6.1 4c.8.8 2 1.2 3.3 1.2s2.5-.4 3.3-1.2c.3-.3.7-.3 1 0s.3.7 0 1c-1.1 1.1-2.7 1.7-4.3 1.7s-3.2-.6-4.3-1.7c-.3-.3-.3-.7 0-1s.7-.3 1 0z"
      />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="share-icon">
      <path
        fill="currentColor"
        d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm8 7.2L19.2 8H4.8L12 13.2zm0 1.6L4 9.4V17h16V9.4l-8 5.4z"
      />
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="share-icon">
      <path
        fill="currentColor"
        d="M10.6 13.4a3.5 3.5 0 0 1 0-5l2.1-2.1a3.5 3.5 0 0 1 5 5l-1 1a.9.9 0 1 1-1.3-1.3l1-1a1.7 1.7 0 0 0-2.4-2.4l-2.1 2.1a1.7 1.7 0 0 0 0 2.4.9.9 0 1 1-1.3 1.3zm2.8-2.8a.9.9 0 0 1 1.3 0 3.5 3.5 0 0 1 0 5l-2.1 2.1a3.5 3.5 0 1 1-5-5l1-1a.9.9 0 1 1 1.3 1.3l-1 1a1.7 1.7 0 1 0 2.4 2.4l2.1-2.1a1.7 1.7 0 0 0 0-2.4.9.9 0 0 1 0-1.3z"
      />
    </svg>
  );
}

function buildTargets(url: string, title: string, text: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);
  const tweet = encodeURIComponent(`${title}\n\n${text}`);

  return [
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${tweet}&url=${encodedUrl}`,
      icon: <IconX />,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <IconFacebook />,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <IconLinkedIn />,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%0A%0A${encodedText}%0A${encodedUrl}`,
      icon: <IconWhatsApp />,
    },
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <IconTelegram />,
    },
    {
      id: "reddit",
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: <IconReddit />,
    },
    {
      id: "email",
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      icon: <IconEmail />,
    },
  ] as const satisfies ReadonlyArray<{
    id: string;
    label: string;
    href: string;
    icon: ReactNode;
  }>;
}

export function ShareChallenge({ title, text }: ShareChallengeProps) {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const targets = useMemo(
    () => (url ? buildTargets(url, title, text) : []),
    [url, title, text],
  );

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setNote("Link copied.");
    } catch {
      setNote("Couldn’t copy. Grab the URL from the address bar.");
    }
  }

  async function nativeShare() {
    if (!url || !navigator.share) return;
    try {
      await navigator.share({ title, text, url });
      setNote("Shared.");
    } catch {
      // User dismissed the sheet.
    }
  }

  return (
    <div className="share-panel">
      <p className="kicker">Share</p>
      <div className="action-row share-row">
        {targets.map((target) => (
          <a
            key={target.id}
            className="btn btn-ghost btn-sm share-chip"
            href={target.href}
            target={target.id === "email" ? undefined : "_blank"}
            rel={target.id === "email" ? undefined : "noopener noreferrer"}
            aria-label={`Share on ${target.label}`}
          >
            {target.icon}
            <span>{target.label}</span>
          </a>
        ))}
        <button
          type="button"
          className="btn btn-ghost btn-sm share-chip"
          onClick={copyLink}
          aria-label="Copy link"
        >
          <IconLink />
          <span>Copy link</span>
        </button>
        {canNativeShare ? (
          <button type="button" className="btn btn-solid btn-sm share-chip" onClick={nativeShare}>
            <span>More</span>
          </button>
        ) : null}
      </div>
      {note ? <p className="action-note">{note}</p> : null}
    </div>
  );
}
