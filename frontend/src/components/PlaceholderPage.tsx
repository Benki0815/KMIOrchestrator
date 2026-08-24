import { APP_VERSION } from "@/lib/version";

export default function PlaceholderPage({
  title,
  hint,
}: {
  title: string;
  hint: string;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-container-max flex-col justify-center px-margin-desktop">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-fixed-dim">
        Kicker Orchestrator · {APP_VERSION}
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold text-on-surface">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-on-surface-variant">{hint}</p>
      <a
        href="/"
        className="mt-8 w-fit rounded-lg bg-primary-container px-4 py-2 font-mono text-xs uppercase tracking-wider text-on-primary-container"
      >
        ← Draft Room
      </a>
    </main>
  );
}
