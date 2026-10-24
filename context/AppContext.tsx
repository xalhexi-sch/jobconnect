"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Job, Application, PendingApproval, RoleType, UserProfile } from "@/lib/types";
import { INITIAL_JOBS, PENDING_APPROVALS, INITIAL_USER_PROFILE } from "@/lib/mock-data";
import { DEFAULT_MOCK_USER, MockUser, isClerkConfigured } from "@/lib/clerk";
import { fetchJobsAction, createJobAction } from "@/app/actions/jobs";
import { submitApplicationAction, updateApplicationStatusAction, fetchUserApplicationsAction } from "@/app/actions/applications";
import { saveUserProfileAction, fetchUserProfileAction } from "@/app/actions/profile";
import confetti from "canvas-confetti";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "info" | "warning";
}

export interface ApplyOptions {
  applicantName?: string;
  applicantEmail?: string;
  phone?: string;
  coverNote?: string;
}

interface AppContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  user: MockUser;
  setUser: React.Dispatch<React.SetStateAction<MockUser>>;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  jobs: Job[];
  applications: Application[];
  pendingApprovals: PendingApproval[];
  bookmarkedJobIds: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  selectedJobType: string;
  setSelectedJobType: (type: string) => void;
  
  // Actions
  toggleBookmark: (jobId: string) => void;
  applyToJob: (job: Job, options?: ApplyOptions | string) => void;
  postJob: (newJob: Omit<Job, "id" | "postedDate" | "appliedCount">) => void;
  approvePending: (id: string) => void;
  rejectPending: (id: string) => void;
  updateJobStatus: (id: string, status: "Active" | "Pending" | "Expired") => void;
  updateApplicationStage: (appId: string, stage: Application["status"]) => void;
  
  // Modals & UI
  applyModalJob: Job | null;
  setApplyModalJob: (job: Job | null) => void;
  isPostJobOpen: boolean;
  setIsPostJobOpen: (open: boolean) => void;
  isResumeModalOpen: boolean;
  setIsResumeModalOpen: (open: boolean) => void;
  isMobileMockupOpen: boolean;
  setIsMobileMockupOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  authMode: "sign-in" | "sign-up";
  setAuthMode: (mode: "sign-in" | "sign-up") => void;
  openAuthModal: (mode?: "sign-in" | "sign-up") => void;
  closeAuthModal: () => void;
  isSignedIn: boolean;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType>("jobseeker");
  const [user, setUser] = useState<MockUser>(DEFAULT_MOCK_USER);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(PENDING_APPROVALS);
  
  // Start with 0 bookmarks - fresh and clean for new users
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>([]);
  
  // Start with 0 applications - new users have NOT applied to anything
  const [applications, setApplications] = useState<Application[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedJobType, setSelectedJobType] = useState("All");

  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isMobileMockupOpen, setIsMobileMockupOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load saved bookmarks from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jobconnect_saved_jobs");
      if (stored) {
        setBookmarkedJobIds(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Initial load from backend (Supabase database)
  useEffect(() => {
    let mounted = true;
    fetchJobsAction().then((loadedJobs) => {
      if (mounted && loadedJobs && loadedJobs.length > 0) {
        setJobs(loadedJobs);
      }
    });

    if (user?.id) {
      fetchUserApplicationsAction(user.id).then((loadedApps) => {
        if (mounted) {
          setApplications(loadedApps || []);
        }
      });
      fetchUserProfileAction(user.id).then((profile) => {
        if (mounted && profile) {
          setUserProfile(profile);
        }
      });
    } else {
      setApplications([]);
    }

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const openAuthModal = (mode: "sign-in" | "sign-up" = "sign-in") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
  };

  const loginUser = (email: string, name?: string) => {
    setIsSignedIn(true);
    const resolvedName = name || email.split("@")[0] || "User";
    setUser((prev) => ({
      ...prev,
      id: prev.id || `user-${Date.now()}`,
      email,
      fullName: resolvedName
    }));
    setUserProfile((prev) => ({
      ...prev,
      email,
      fullName: resolvedName
    }));
    setIsAuthOpen(false);
    showToast(`Signed in as ${resolvedName}!`, "success");
  };

  const logoutUser = () => {
    setIsSignedIn(false);
    setUser(DEFAULT_MOCK_USER);
    setApplications([]);
    showToast("Signed out", "info");
  };

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: RoleType) => {
    setRoleState(newRole);
    setUser((prev) => ({
      ...prev,
      role: newRole,
      fullName: prev.fullName || (newRole === "employer" ? "Verified Employer" : "Jobseeker"),
      email: prev.email || (newRole === "employer" ? "employer@butuan.tech" : "")
    }));
    showToast(
      `Switched to ${
        newRole === "admin"
          ? "Admin Dashboard 🛡️"
          : newRole === "employer"
          ? "Employer Hiring Portal 🏢"
          : "Jobseeker Portal 🎯"
      }`,
      "info"
    );
  };

  const updateUserProfile = (updatedFields: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updatedFields }));
    if (user?.id) {
      saveUserProfileAction(updatedFields);
    }
    showToast("Profile updated successfully!", "success");
    setIsResumeModalOpen(false);
  };

  const toggleBookmark = (jobId: string) => {
    setBookmarkedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const next = exists ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      try {
        localStorage.setItem("jobconnect_saved_jobs", JSON.stringify(next));
      } catch {}
      showToast(exists ? "Removed from saved jobs" : "Saved to your bookmarks!", "info");
      return next;
    });
  };

  const applyToJob = async (job: Job, options?: ApplyOptions | string) => {
    const coverNote = typeof options === "string" ? options : options?.coverNote;
    const optName = typeof options === "object" ? options?.applicantName : undefined;
    const optEmail = typeof options === "object" ? options?.applicantEmail : undefined;
    const optPhone = typeof options === "object" ? options?.phone : undefined;

    const applicantName = optName || user.fullName || userProfile.fullName || "Applicant";
    const applicantEmail = optEmail || user.email || userProfile.email || "applicant@jobconnect.bxu";
    const phone = optPhone || userProfile.phone;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      salary: job.salary,
      appliedDate: "Just now",
      status: "Submitted",
      applicantName,
      applicantEmail,
      coverLetter: coverNote
    };

    // Optimistic UI update
    setApplications((prev) => [newApp, ...prev]);
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, appliedCount: j.appliedCount + 1 } : j))
    );

    // Save user profile details so future applications are faster
    if (optName || optEmail || optPhone) {
      setUserProfile((prev) => ({
        ...prev,
        fullName: applicantName,
        email: applicantEmail,
        phone: phone || prev.phone
      }));
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(`Application successfully sent to ${job.company}! 🎉`, "success");
    setApplyModalJob(null);

    // Persist via Server Action to Supabase
    await submitApplicationAction({
      jobId: job.id,
      applicantId: user.id || `guest-${Date.now()}`,
      applicantName,
      applicantEmail,
      phone,
      coverLetter: coverNote
    });
  };

  const postJob = async (newJobData: Omit<Job, "id" | "postedDate" | "appliedCount">) => {
    const tempId = `job-${Date.now()}`;
    const newJob: Job = {
      ...newJobData,
      id: tempId,
      postedDate: "Just now",
      appliedCount: 0
    };

    // Optimistic UI update
    setJobs((prev) => [newJob, ...prev]);
    showToast(`Vacancy "${newJob.title}" posted to JobConnect Caraga!`, "success");
    setIsPostJobOpen(false);

    // Persist via Server Action
    await createJobAction(newJobData);
  };

  const approvePending = (id: string) => {
    const item = pendingApprovals.find((p) => p.id === id);
    if (!item) return;

    showToast(`Verified business account: ${item.company}`, "success");
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
  };

  const rejectPending = (id: string) => {
    const item = pendingApprovals.find((p) => p.id === id);
    if (item) {
      showToast(`Rejected submission: ${item.company}`, "info");
    }
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
  };

  const updateJobStatus = (id: string, status: "Active" | "Pending" | "Expired") => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status } : j))
    );
    showToast(`Job listing marked as ${status}`, "info");
  };

  const updateApplicationStage = async (appId: string, stage: Application["status"]) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: stage } : a))
    );
    showToast(`Candidate stage moved to: ${stage}`, "success");

    // Persist via Server Action
    await updateApplicationStatusAction(appId, stage);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        userProfile,
        updateUserProfile,
        jobs,
        applications,
        pendingApprovals,
        bookmarkedJobIds,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedCity,
        setSelectedCity,
        selectedLocation,
        setSelectedLocation,
        selectedJobType,
        setSelectedJobType,
        toggleBookmark,
        applyToJob,
        postJob,
        approvePending,
        rejectPending,
        updateJobStatus,
        updateApplicationStage,
        applyModalJob,
        setApplyModalJob,
        isPostJobOpen,
        setIsPostJobOpen,
        isResumeModalOpen,
        setIsResumeModalOpen,
        isMobileMockupOpen,
        setIsMobileMockupOpen,
        isAuthOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        isSignedIn,
        setIsSignedIn,
        setUser,
        loginUser,
        logoutUser,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
