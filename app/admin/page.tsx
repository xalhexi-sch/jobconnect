import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AdminConsole from "./AdminConsole";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

async function Gate() {
  const user = await getSessionUser();
  if (user?.role !== "admin") {
    return (
      <div className="max-w-sm mx-auto py-24 text-center px-6">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admins only</h1>
        <p className="text-fg-muted mt-2">You don’t have access to this area.</p>
      </div>
    );
  }
  return <AdminConsole />;
}

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-line h-16 px-4 sm:px-6 flex items-center">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/overview" className="flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-fg">
            <ArrowLeft className="w-4 h-4" /> Back to app
          </Link>
          <span className="font-bold">Admin console</span>
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Suspense fallback={<div className="skeleton h-64 w-full rounded-2xl" />}>
          <Gate />
        </Suspense>
      </main>
    </div>
  );
}
