export type JobStatus = "Active" | "Pending" | "Expired";
export type JobType = "On-site" | "Hybrid" | "Remote (Caraga)" | "Remote";
export type RoleType = "jobseeker" | "employer" | "admin";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  barangay?: string;
  city: "Butuan City" | "Cabadbaran City" | "Surigao City" | "Bayugan City" | "Bislig City" | "Caraga Region";
  salary: string;
  salaryPhp: number; // numeric for sorting/filtering
  type: JobType;
  category: "Design" | "Developer" | "Security" | "Marketing" | "Healthcare" | "Admin & Support";
  status: JobStatus;
  postedDate: string;
  appliedCount: number;
  featured?: boolean;
  description: string;
  requirements: string[];
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: "Submitted" | "Under Review" | "Interview Scheduled" | "Offer Extended" | "Rejected";
  interviewDate?: string;
}

export interface PendingApproval {
  id: string;
  company: string;
  logo: string;
  location: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  bio: string;
  skills: string[];
  education: string;
  portfolioUrl: string;
  resumeFileName: string;
  resumeUpdated: string;
  expectedSalary: string;
}

export interface Startup {
  id: string;
  name: string;
  jobsCount: number;
  description: string;
  type: JobType;
  location: string;
  logoBg: string;
  iconName: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  quote: string;
  avatar: string;
  videoDuration?: string;
}
