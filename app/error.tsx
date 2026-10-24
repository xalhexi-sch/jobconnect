"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
          <TriangleAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
        <p className="text-fg-muted mt-2 leading-relaxed">That’s on us. Your data is safe. Try again, and if it keeps happening, come back in a few minutes.</p>
        <button onClick={reset} className="btn-brand-primary h-11 px-6 rounded-xl text-sm font-semibold mt-6 cursor-pointer">Try again</button>
      </div>
    </main>
  );
}
