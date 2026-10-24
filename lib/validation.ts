import { z } from "zod";

export const JOB_CATEGORIES = [
  "Design", "Developer", "Security", "Marketing", "Healthcare", "Admin & Support", "Hospitality", "Trades & Logistics",
] as const;
export const JOB_TYPES = ["On-site", "Hybrid", "Remote (Caraga)", "Remote"] as const;
export const CITIES = [
  "Butuan City", "Cabadbaran City", "Surigao City", "Bayugan City", "Bislig City", "Caraga Region",
] as const;

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const httpsUrl = z.string().trim().url().max(500).refine((u) => u.startsWith("https://"), "Must be an https URL");

export const jobInputSchema = z.object({
  title: text(3, 120),
  company: text(2, 120),
  companyLogo: httpsUrl.or(z.string().regex(/^\/[\w./-]{1,200}$/)).optional().or(z.literal("")),
  location: text(2, 160),
  barangay: optionalText(80),
  city: z.enum(CITIES).default("Butuan City"),
  salary: text(1, 80),
  salaryPhp: z.number().int().min(0).max(10_000_000),
  type: z.enum(JOB_TYPES),
  category: z.enum(JOB_CATEGORIES),
  description: text(20, 5000),
  requirements: z.array(text(1, 200)).max(20).default([]),
  featured: z.boolean().optional(),
});

export const applicationInputSchema = z.object({
  jobId: text(1, 100),
  applicantName: text(2, 120).optional(),
  applicantEmail: z.string().trim().email().max(200).optional(),
  phone: z.string().trim().max(30).regex(/^[+\d\s()-]*$/, "Invalid phone number").optional(),
  coverLetter: z.string().trim().max(3000).optional(),
});

export const EMPLOYER_STAGES = ["Under Review", "Interview Scheduled", "Offer Extended", "Rejected"] as const;
export const statusUpdateSchema = z.object({
  applicationId: text(1, 100),
  status: z.enum(["Submitted", ...EMPLOYER_STAGES, "Withdrawn"]),
  interviewDate: z.string().trim().max(120).optional(),
});

export const onboardingSchema = z.object({
  role: z.enum(["jobseeker", "employer"]),
  fullName: text(2, 120),
  phone: z.string().trim().max(30).regex(/^[+\d\s()-]*$/).optional().or(z.literal("")),
  location: optionalText(160),
  headline: optionalText(160),
  companyName: optionalText(120),
  companyIndustry: optionalText(80),
});

export const profileUpdateSchema = z.object({
  fullName: text(2, 120).optional(),
  phone: z.string().trim().max(30).regex(/^[+\d\s()-]*$/).optional().or(z.literal("")),
  location: optionalText(160),
  headline: optionalText(160),
  bio: optionalText(2000),
  skills: z.array(text(1, 40)).max(40).optional(),
  education: optionalText(300),
  portfolioUrl: httpsUrl.optional().or(z.literal("")),
  expectedSalary: optionalText(60),
  companyName: optionalText(120),
  companyIndustry: optionalText(80),
});

export function firstIssue(err: z.ZodError): string {
  const i = err.issues[0];
  return i ? `${i.path.join(".") || "input"}: ${i.message}` : "Invalid input";
}
