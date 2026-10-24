// Seamless Clerk authentication configuration & user types

export const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder")
);

export const isClerkServerConfigured = Boolean(
  isClerkConfigured &&
  process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes("placeholder")
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

export const EMPTY_USER: MockUser = {
  id: "",
  fullName: "",
  email: "",
  role: "jobseeker",
  location: "Butuan City",
  avatar: "",
  notificationsCount: 0
};

export const DEFAULT_MOCK_USER: MockUser = EMPTY_USER;
