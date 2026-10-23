import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (isClerkConfigured && publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        {children}
      </ClerkProvider>
    );
  }

  return <>{children}</>;
}
