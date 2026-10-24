"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { syncClerkUserAction } from "@/app/actions/profile";
import { useApp } from "@/context/AppContext";
import { isClerkConfigured } from "@/lib/clerk";

export default function ClerkSync() {
  if (!isClerkConfigured) return null;
  return <ClerkSyncInner />;
}

function ClerkSyncInner() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { setUser, setIsSignedIn } = useApp();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress || "";
      const fullName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        email.split("@")[0] ||
        "Butuan User";
      const avatar = user.imageUrl || "/hero-applicant.png";

      // Sync user state into AppContext
      setIsSignedIn(true);
      setUser((prev) => ({
        ...prev,
        id: user.id,
        fullName,
        email,
        avatar,
      }));

      // Upsert profile in Supabase database
      if (syncedRef.current !== user.id) {
        syncedRef.current = user.id;
        syncClerkUserAction({
          id: user.id,
          fullName,
          email,
          avatarUrl: avatar,
          role: (user.publicMetadata?.role as string) || "jobseeker",
        }).catch((err) => {
          console.warn("Clerk to Supabase sync warning:", err);
        });
      }
    } else if (isLoaded && !isSignedIn) {
      setIsSignedIn(false);
    }
  }, [isLoaded, isSignedIn, user, setUser, setIsSignedIn]);

  return null;
}
