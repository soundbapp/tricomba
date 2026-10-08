import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SignUpPage() {
  return (
    <div className="page-pad auth-page">
      <p className="kicker">Join the card</p>
      <h1>Create account</h1>
      {clerkEnabled ? (
        <div className="auth-frame">
          <SignUp />
        </div>
      ) : (
        <div className="detail-panel">
          <p className="lede">
            Clerk is not configured. Copy `.env.example` to `.env.local` and add your Clerk keys.
          </p>
          <Link href="/" className="btn btn-solid">
            Back home
          </Link>
        </div>
      )}
    </div>
  );
}
