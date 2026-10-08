import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Figtree, Syne } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "TRICOMBA",
    template: "%s — TRICOMBA",
  },
  description:
    "TRICOMBA — trial by combat for the digital age. Challenge anyone. If they accept, settle it for real in a licensed gym.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://tricomba.vercel.app",
  ),
  openGraph: {
    type: "website",
    siteName: "TRICOMBA",
    title: "TRICOMBA",
    description:
      "Trial by combat for the digital age. Challenge anyone. Settle it for real in a licensed gym.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TRICOMBA",
    description:
      "Trial by combat for the digital age. Challenge anyone. Settle it for real in a licensed gym.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = <SiteShell>{children}</SiteShell>;

  return (
    <html lang="en" className={`${figtree.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full">
        {clerkEnabled ? (
          <ClerkProvider
            afterSignOutUrl="/"
            appearance={{
              variables: {
                colorPrimary: "#ff2546",
                colorForeground: "#111114",
                borderRadius: "0.75rem",
              },
            }}
          >
            {body}
          </ClerkProvider>
        ) : (
          body
        )}
      </body>
    </html>
  );
}
