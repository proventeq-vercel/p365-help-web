import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell py-16">
      <div className="mx-auto max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This documentation page does not exist. Use the home page to navigate to a valid section.
        </p>
        <Link className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href="/">
          Go to docs home
        </Link>
      </div>
    </div>
  );
}
