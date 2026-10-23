// Seamless Clerk authentication configuration & mock provider
// Works seamlessly out of the box, and switches to live Clerk once API keys are provided.

export const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder")
);

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  role: "jobseeker" | "employer" | "admin";
  location: string;
  avatar: string;
  notificationsCount: number;
}

export const DEFAULT_MOCK_USER: MockUser = {
  id: "user-maria",
  fullName: "Maria Santos",
  email: "maria.santos@caraga.tech",
  role: "jobseeker",
  location: "Bancasi, Butuan City",
  avatar: "/hero-applicant.png",
  notificationsCount: 3
};
