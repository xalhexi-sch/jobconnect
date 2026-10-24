import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
const isProtected = createRouteMatcher(["/admin(.*)", "/employer(.*)"]);

// Fail closed: without Clerk configured, protected areas are unavailable rather than open.
const proxy = hasClerk
  ? clerkMiddleware(async (auth, req) => {
      if (isProtected(req)) await auth.protect();
    })
  : (req: NextRequest) =>
      isProtected(req)
        ? new NextResponse("Authentication is not configured", { status: 503 })
        : NextResponse.next();

export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
