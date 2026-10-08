import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-pad">
      <p className="kicker">404</p>
      <h1>This isn’t in the feed.</h1>
      <p className="lede">That challenge, profile, or page isn’t here.</p>
      <Link href="/" className="btn btn-solid">
        Back to TRICOMBA
      </Link>
    </div>
  );
}
