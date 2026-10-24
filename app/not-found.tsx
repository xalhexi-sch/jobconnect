import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-surface-2 flex items-center justify-center text-fg-muted">
          <SearchX className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">We couldn’t find that page</h1>
        <p className="text-fg-muted mt-2 leading-relaxed">The job may have been filled or taken down, or the link is mistyped.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/overview" className="btn-brand-primary h-11 px-6 rounded-xl text-sm font-semibold flex items-center justify-center">Browse jobs</Link>
          <Link href="/" className="h-11 px-6 rounded-xl border border-line bg-surface-2 text-sm font-semibold flex items-center justify-center">Go home</Link>
        </div>
      </div>
    </main>
  );
}
