import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import JobgioLogo from "@/components/JobgioLogo";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0D0E12] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient gradient glow like Supabase/Clerk */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-600/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <div className="mb-6 flex flex-col items-center gap-3 z-10">
        <Link href="/" className="hover:opacity-90 transition-opacity flex items-center gap-2">
          <JobgioLogo variant="light" size="md" />
        </Link>
        <p className="text-xs text-neutral-400">
          Create your Butuan City JobConnect account
        </p>
      </div>

      {/* Clerk SignUp Component Container */}
      <div className="z-10 shadow-2xl rounded-2xl border border-white/10 bg-[#16171D]/90 backdrop-blur-xl p-2 sm:p-4">
        <Suspense fallback={<div className="p-8 text-neutral-400 text-xs text-center">Loading Clerk...</div>}>
          <SignUp
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-white font-bold",
                headerSubtitle: "text-neutral-400 text-xs",
                formButtonPrimary: "btn-supabase-emerald text-xs font-semibold py-2.5",
                formFieldInput: "bg-neutral-900/80 border-white/10 text-white rounded-xl focus:border-emerald-500",
                footerActionLink: "text-emerald-400 hover:text-emerald-300 font-semibold",
                socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                dividerLine: "bg-white/10",
                dividerText: "text-neutral-500 text-xs",
              }
            }}
          />
        </Suspense>
      </div>

      <div className="mt-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Butuan JobConnect Home</span>
        </Link>
      </div>
    </div>
  );
}
