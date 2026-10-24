import { supabase, isSupabaseConfigured, getSupabaseAdmin } from "./supabase";
import { INITIAL_JOBS, INITIAL_USER_PROFILE } from "./mock-data";
import { Job, Application, UserProfile } from "./types";

// In-memory runtime cache for fallback mode during interactive demos
let memoryJobs: (Job & { employerId?: string })[] = [...INITIAL_JOBS];
let memoryApplications: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    applicantId: "user-maria",
    applicantName: "Maria Santos",
    applicantEmail: "maria.santos@caraga.tech",
    employerId: "user-demo-employer",
    jobTitle: "Lead UI/UX Designer",
    company: "TechVenture Caraga",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    location: "Montilla Blvd, Butuan City",
    salary: "₱65,000/mo",
    appliedDate: "Oct 22, 2026",
    status: "Under Review"
  },
  {
    id: "app-2",
    jobId: "job-2",
    applicantId: "user-maria",
    applicantName: "Maria Santos",
    applicantEmail: "maria.santos@caraga.tech",
    employerId: "user-demo-employer",
    jobTitle: "Full-Stack Web Developer",
    company: "CSU Innovation Hub",
    companyLogo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80",
    location: "Ampayon, Butuan City",
    salary: "₱50,000/mo",
    appliedDate: "Oct 21, 2026",
    status: "Interview Scheduled",
    interviewDate: "Oct 28, 2026 - 10:00 AM (CSU Main)"
  }
];
let memoryProfile: UserProfile = { ...INITIAL_USER_PROFILE };

export async function getJobsFromDb(filterCategory?: string): Promise<Job[]> {
  if (!isSupabaseConfigured) {
    if (filterCategory && filterCategory !== "All") {
      return memoryJobs.filter((j) => j.category === filterCategory);
    }
    return memoryJobs;
  }

  try {
    let query = supabase.from("jobs").select("*").eq("status", "Active");
    if (filterCategory && filterCategory !== "All") {
      query = query.eq("category", filterCategory);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase fetch jobs warning:", error.message);
      return memoryJobs;
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      company: item.company,
      companyLogo: item.company_logo || "/hero-applicant.png",
      location: item.location,
      barangay: item.barangay,
      city: item.city || "Butuan City",
      salary: item.salary,
      salaryPhp: item.salary_php || 0,
      type: item.type,
      category: item.category,
      status: item.status,
      postedDate: new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      appliedCount: item.applied_count || 0,
      featured: item.featured || false,
      description: item.description,
      requirements: item.requirements || [],
      employerId: item.employer_id,
    }));
  } catch (err) {
    console.warn("Supabase query error, falling back to memory:", err);
    return memoryJobs;
  }
}

export async function insertJobToDb(job: Partial<Job> & { employerId?: string }): Promise<Job> {
  const generatedId = job.id || `job-${Date.now()}`;
  const employerId = job.employerId || "user-demo-employer";

  const newJob: Job = {
    id: generatedId,
    title: job.title || "Untitled Opening",
    company: job.company || "Butuan Enterprise",
    companyLogo: job.companyLogo || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=120&auto=format&fit=crop&q=80",
    location: job.location || "Montilla Blvd, Butuan City",
    barangay: job.barangay || "Montilla Blvd",
    city: job.city || "Butuan City",
    salary: job.salary || "₱20,000 - ₱30,000 / month",
    salaryPhp: job.salaryPhp || 25000,
    type: job.type || "On-site",
    category: job.category || "Developer",
    status: "Active",
    postedDate: "Just now",
    appliedCount: 0,
    featured: Boolean(job.featured),
    description: job.description || "Exciting opportunity in Butuan City.",
    requirements: job.requirements || ["Hardworking and dedicated", "Good communication skills"],
  };

  memoryJobs = [newJob, ...memoryJobs];

  if (isSupabaseConfigured) {
    try {
      const admin = getSupabaseAdmin();

      // Ensure employer profile exists in profiles table
      await admin.from("profiles").upsert(
        {
          id: employerId,
          full_name: job.company || "Local Employer",
          email: `${employerId}@jobconnect.ph`,
          role: "employer",
          location: newJob.location,
        },
        { onConflict: "id" }
      );

      const { data, error } = await admin
        .from("jobs")
        .insert({
          id: newJob.id,
          employer_id: employerId,
          title: newJob.title,
          company: newJob.company,
          company_logo: newJob.companyLogo,
          location: newJob.location,
          barangay: newJob.barangay,
          city: newJob.city,
          salary: newJob.salary,
          salary_php: newJob.salaryPhp,
          type: newJob.type,
          category: newJob.category,
          status: newJob.status,
          description: newJob.description,
          requirements: newJob.requirements,
          featured: newJob.featured,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert job error:", error.message);
      } else if (data) {
        newJob.id = data.id;
      }
    } catch (err) {
      console.warn("Failed to persist job to Supabase:", err);
    }
  }

  return newJob;
}

// SECURE: Fetch ONLY applications belonging to this specific applicant
export async function getApplicationsFromDb(userId: string): Promise<Application[]> {
  if (!userId) return [];

  if (!isSupabaseConfigured) {
    return memoryApplications.filter((a) => a.applicantId === userId);
  }

  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*, jobs(*)")
      .eq("applicant_id", userId)
      .order("applied_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch applications warning:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      jobId: item.job_id,
      applicantId: item.applicant_id,
      applicantName: item.applicant_name,
      applicantEmail: item.applicant_email,
      employerId: item.jobs?.employer_id,
      jobTitle: item.jobs?.title || "Job Application",
      company: item.jobs?.company || "Local Enterprise",
      companyLogo: item.jobs?.company_logo || "/hero-applicant.png",
      location: item.jobs?.location || "Butuan City",
      salary: item.jobs?.salary || "Competitive",
      appliedDate: new Date(item.applied_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: item.status,
      interviewDate: item.interview_date,
    }));
  } catch (err) {
    console.warn("Supabase applications error:", err);
    return [];
  }
}

// SECURE: Fetch ONLY applications for jobs posted by this employer
export async function getEmployerApplicationsFromDb(employerId: string): Promise<Application[]> {
  if (!employerId) return [];

  if (!isSupabaseConfigured) {
    return memoryApplications.filter((a) => a.employerId === employerId || employerId === "user-demo-employer");
  }

  try {
    const admin = getSupabaseAdmin();
    // 1. Get IDs of jobs posted by this employer
    const { data: myJobs, error: jobErr } = await admin
      .from("jobs")
      .select("id")
      .eq("employer_id", employerId);

    if (jobErr || !myJobs || myJobs.length === 0) {
      return [];
    }

    const jobIds = myJobs.map((j) => j.id);

    // 2. Query only applications for those specific job IDs
    const { data, error } = await admin
      .from("applications")
      .select("*, jobs(*)")
      .in("job_id", jobIds)
      .order("applied_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      jobId: item.job_id,
      applicantId: item.applicant_id,
      applicantName: item.applicant_name,
      applicantEmail: item.applicant_email,
      employerId: item.jobs?.employer_id,
      jobTitle: item.jobs?.title || "Job Application",
      company: item.jobs?.company || "Local Enterprise",
      companyLogo: item.jobs?.company_logo || "/hero-applicant.png",
      location: item.jobs?.location || "Butuan City",
      salary: item.jobs?.salary || "Competitive",
      appliedDate: new Date(item.applied_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: item.status,
      interviewDate: item.interview_date,
    }));
  } catch (err) {
    console.warn("Supabase employer applications error:", err);
    return [];
  }
}

export async function insertApplicationToDb(application: {
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  phone?: string;
  coverLetter?: string;
  resumeUrl?: string;
}): Promise<Application> {
  const matchingJob = memoryJobs.find((j) => j.id === application.jobId);
  const newApp: Application = {
    id: `app-${Date.now()}`,
    jobId: application.jobId,
    applicantId: application.applicantId,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    employerId: matchingJob?.employerId || "user-demo-employer",
    jobTitle: matchingJob?.title || "Job Position",
    company: matchingJob?.company || "Butuan Enterprise",
    companyLogo: matchingJob?.companyLogo || "/hero-applicant.png",
    location: matchingJob?.location || "Butuan City",
    salary: matchingJob?.salary || "Competitive",
    appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "Submitted",
  };

  memoryApplications = [newApp, ...memoryApplications];

  if (matchingJob) {
    matchingJob.appliedCount = (matchingJob.appliedCount || 0) + 1;
  }

  if (isSupabaseConfigured) {
    try {
      const admin = getSupabaseAdmin();

      // Ensure applicant profile exists
      await admin.from("profiles").upsert(
        {
          id: application.applicantId,
          full_name: application.applicantName,
          email: application.applicantEmail,
          phone: application.phone || "",
          role: "jobseeker",
          location: "Butuan City",
        },
        { onConflict: "id" }
      );

      const { data, error } = await admin
        .from("applications")
        .insert({
          id: newApp.id,
          job_id: application.jobId,
          applicant_id: application.applicantId,
          applicant_name: application.applicantName,
          applicant_email: application.applicantEmail,
          phone: application.phone,
          cover_letter: application.coverLetter,
          resume_url: application.resumeUrl,
          status: "Submitted",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert application error:", error.message);
      } else if (data) {
        newApp.id = data.id;
      }
    } catch (err) {
      console.warn("Failed to persist application to Supabase:", err);
    }
  }

  return newApp;
}

export async function updateApplicationStatusInDb(
  applicationId: string,
  newStatus: Application["status"],
  interviewDate?: string
): Promise<boolean> {
  const app = memoryApplications.find((a) => a.id === applicationId);
  if (app) {
    app.status = newStatus;
    if (interviewDate) app.interviewDate = interviewDate;
  }

  if (isSupabaseConfigured) {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin
        .from("applications")
        .update({ status: newStatus, interview_date: interviewDate })
        .eq("id", applicationId);

      if (error) {
        console.error("Supabase update application error:", error.message);
      }
    } catch (err) {
      console.warn("Failed to update status in Supabase:", err);
    }
  }

  return true;
}

export async function getProfileFromDb(userId: string): Promise<UserProfile> {
  if (!isSupabaseConfigured) {
    return memoryProfile;
  }

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error || !data) return memoryProfile;

    return {
      id: data.id,
      fullName: data.full_name || "",
      email: data.email || "",
      phone: data.phone || "",
      role: data.role || "jobseeker",
      companyName: data.company_name || "",
      companyIndustry: data.company_industry || "",
      onboarded: Boolean(data.onboarded),
      location: data.location || "Butuan City",
      headline: data.headline || "",
      bio: data.bio || "",
      skills: data.skills || [],
      education: data.education || "",
      portfolioUrl: data.portfolio_url || "",
      resumeFileName: data.resume_url ? "Uploaded_Resume.pdf" : "",
      resumeUpdated: data.updated_at ? new Date(data.updated_at).toLocaleDateString() : "",
      expectedSalary: data.expected_salary || "",
    };
  } catch {
    return memoryProfile;
  }
}

export async function updateProfileInDb(profile: Partial<UserProfile>): Promise<UserProfile> {
  memoryProfile = { ...memoryProfile, ...profile };
  if (isSupabaseConfigured && profile.id) {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from("profiles").upsert({
        id: profile.id,
        full_name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        skills: profile.skills,
        education: profile.education,
        portfolio_url: profile.portfolioUrl,
        role: profile.role,
        company_name: profile.companyName,
        company_industry: profile.companyIndustry,
        onboarded: profile.onboarded,
      });
      if (error) {
        console.error("Supabase update profile error:", error.message);
      }
    } catch (err) {
      console.warn("Failed to update profile in Supabase:", err);
    }
  }
  return memoryProfile;
}
