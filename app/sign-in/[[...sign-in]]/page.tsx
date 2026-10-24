import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import JobgioLogo from "@/components/JobgioLogo";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#111116] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Soft, calming ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-blue-500/8 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-indigo-500/5 blur-[90px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <div className="mb-6 flex flex-col items-center gap-2 z-10">
        <Link href="/" className="hover:opacity-85 transition-opacity flex items-center gap-2">
          <JobgioLogo variant="dark" size="md" />
        </Link>
        <p className="text-xs text-neutral-500 font-medium">
          Sign in to your Butuan City JobConnect account
        </p>
      </div>

      {/* Clean, Readable Card */}
      <div className="z-10 shadow-xl rounded-3xl border border-neutral-200/90 bg-white p-4 sm:p-6 max-w-md w-full">
        <Suspense fallback={<div className="p-8 text-neutral-400 text-xs text-center">Loading Clerk sign-in...</div>}>
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/overview"
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-none p-0 w-full",
                headerTitle: "text-neutral-900 font-bold text-xl tracking-tight",
                headerSubtitle: "text-neutral-500 text-xs mt-1",
                formButtonPrimary: "btn-supabase-emerald text-white text-xs font-semibold py-2.5 rounded-xl cursor-pointer shadow-sm hover:opacity-95 transition-opacity",
                formFieldLabel: "text-neutral-700 text-xs font-semibold mb-1",
                formFieldInput: "bg-white border border-neutral-300 text-neutral-900 rounded-xl focus:border-blue-600 text-xs py-2 px-3 shadow-2xs",
                footerActionLink: "text-blue-700 hover:text-blue-800 font-semibold text-xs",
                footerActionText: "text-neutral-500 text-xs",
                socialButtonsBlockButton: "bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 rounded-xl text-xs font-medium py-2 shadow-2xs",
                dividerLine: "bg-neutral-200",
                dividerText: "text-neutral-400 text-xs font-medium",
                identityPreviewText: "text-neutral-900 text-xs font-medium",
                identityPreviewEditButton: "text-blue-700 text-xs font-semibold",
              }
            }}
          />
        </Suspense>
      </div>

      <div className="mt-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
