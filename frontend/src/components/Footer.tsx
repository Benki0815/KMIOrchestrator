import { APP_VERSION } from "@/lib/version";

export function Footer() {
  return (
    <footer className="fixed bottom-0 z-40 w-full border-t border-outline-variant/20 bg-background/90 backdrop-blur-md">
      <div className="flex w-full items-center justify-center px-8 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-primary-fixed-dim">
          {APP_VERSION}
        </span>
      </div>
    </footer>
  );
}
