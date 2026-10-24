"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useApp } from "@/context/AppContext";
import { isClerkConfigured, DEFAULT_MOCK_USER } from "@/lib/clerk";

export default function ClerkSync() {
  if (!isClerkConfigured) return null;
  return <ClerkSyncInner />;
}

/** Mirrors the Clerk session into AppContext. Roles and profile data come from the server, never from here. */
function ClerkSyncInner() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { setUser, setIsSignedIn } = useApp();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress || "";
      const fullName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        email.split("@")[0] ||
        "Butuan User";
      setIsSignedIn(true);
      setUser((prev) => ({ ...prev, id: user.id, fullName, email, avatar: user.imageUrl || "/hero-applicant.png" }));
    } else {
      setIsSignedIn(false);
      setUser(DEFAULT_MOCK_USER);
    }
  }, [isLoaded, isSignedIn, user, setUser, setIsSignedIn]);

  return null;
}
