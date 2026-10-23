"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Job, Application, PendingApproval, RoleType, UserProfile } from "@/lib/types";
import { INITIAL_JOBS, PENDING_APPROVALS, INITIAL_USER_PROFILE } from "@/lib/mock-data";
import { DEFAULT_MOCK_USER, MockUser } from "@/lib/clerk";
import { fetchJobsAction, createJobAction } from "@/app/actions/jobs";
import { submitApplicationAction, updateApplicationStatusAction, fetchUserApplicationsAction } from "@/app/actions/applications";
import { saveUserProfileAction, fetchUserProfileAction } from "@/app/actions/profile";
import confetti from "canvas-confetti";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "info" | "warning";
}

interface AppContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  user: MockUser;
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
  applyToJob: (job: Job, coverNote?: string) => void;
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
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>(["job-1", "job-2", "job-3"]);
  
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app-1",
      jobId: "job-1",
      jobTitle: "Lead UI/UX Designer",
      company: "TechVenture Caraga",
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      location: "Montilla Blvd, Butuan City",
      salary: "₱65,000/mo",
      appliedDate: "Yesterday, 10:45 AM",
      status: "Interview Scheduled",
      interviewDate: "Tomorrow at 2:00 PM (Google Meet / In-person Bancasi)"
    },
    {
      id: "app-2",
      jobId: "job-2",
      jobTitle: "Full-Stack Web Developer",
      company: "CSU Innovation Hub",
      companyLogo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80",
      location: "Ampayon, Butuan City",
      salary: "₱50,000/mo",
      appliedDate: "Oct 21, 2026",
      status: "Under Review"
    },
    {
      id: "app-3",
      jobId: "job-3",
      jobTitle: "IT Systems Administrator",
      company: "Father Saturnino Urios University",
      companyLogo: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=120&auto=format&fit=crop&q=80",
      location: "J.C. Aquino Ave, Butuan City",
      salary: "₱35,000/mo",
      appliedDate: "Oct 18, 2026",
      status: "Submitted"
    }
  ]);

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
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Initial load from backend (Supabase or local DB helper)
  useEffect(() => {
    let mounted = true;
    fetchJobsAction().then((loadedJobs) => {
      if (mounted && loadedJobs && loadedJobs.length > 0) {
        setJobs(loadedJobs);
      }
    });
    if (user?.id) {
      fetchUserApplicationsAction(user.id).then((loadedApps) => {
        if (mounted && loadedApps && loadedApps.length > 0) {
          setApplications(loadedApps);
        }
      });
      fetchUserProfileAction(user.id).then((profile) => {
        if (mounted && profile) {
          setUserProfile(profile);
        }
      });
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
    setUser((prev) => ({
      ...prev,
      email,
      fullName: name || prev.fullName
    }));
    setIsAuthOpen(false);
    showToast(`Signed in as ${name || email}!`, "success");
  };

  const logoutUser = () => {
    setIsSignedIn(false);
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
      fullName:
        newRole === "admin"
          ? "Admin Moderator"
          : newRole === "employer"
          ? "George Martinez (HR)"
          : "Juan Dela Cruz",
      email:
        newRole === "admin"
          ? "admin@jobconnect.butuan"
          : newRole === "employer"
          ? "george@techventure.ph"
          : "juan.delacruz@caraga.tech",
      location:
        newRole === "admin"
          ? "JobConnect HQ, Butuan"
          : newRole === "employer"
          ? "Bancasi, Butuan City"
          : "Doongan, Butuan City",
      avatar:
        newRole === "admin"
          ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
          : newRole === "employer"
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }));
    showToast(
      `Switched to ${
        newRole === "admin"
          ? "Admin Dashboard 🛡️"
          : newRole === "employer"
          ? "Employer Portal 👔"
          : "Jobseeker Hub 🎯"
      }`,
      "info"
    );
  };

  const updateUserProfile = (updatedFields: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updatedFields }));
    saveUserProfileAction(updatedFields);
    showToast("Profile & portfolio updated successfully!", "success");
    setIsResumeModalOpen(false);
  };

  const toggleBookmark = (jobId: string) => {
    setBookmarkedJobIds((prev) => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast("Removed from saved jobs", "info");
        return prev.filter((id) => id !== jobId);
      } else {
        showToast("Saved to your JobConnect bookmarks!", "success");
        return [...prev, jobId];
      }
    });
  };

  const applyToJob = async (job: Job, coverNote?: string) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      salary: job.salary,
      appliedDate: "Just now",
      status: "Submitted"
    };

    // Optimistic UI update
    setApplications((prev) => [newApp, ...prev]);
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, appliedCount: j.appliedCount + 1 } : j))
    );

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

    // Persist via Server Action
    await submitApplicationAction({
      jobId: job.id,
      applicantId: user.id || "user-maria",
      applicantName: user.fullName || "Maria Santos",
      applicantEmail: user.email || "maria.santos@caraga.tech",
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
    await createJobAction({
      ...newJobData,
      employerId: user.id || "user-demo-employer",
    });
  };

  const approvePending = (id: string) => {
    setPendingApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Approved" } : item))
    );
    showToast("Employer verified and listing published to live Caraga directory!", "success");
  };

  const rejectPending = (id: string) => {
    setPendingApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Rejected" } : item))
    );
    showToast("Employer verification rejected.", "warning");
  };

  const updateJobStatus = (id: string, status: "Active" | "Pending" | "Expired") => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status } : j))
    );
    showToast(`Listing status updated to ${status}`, "info");
  };

  const updateApplicationStage = async (appId: string, stage: Application["status"]) => {
    // Optimistic UI update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: stage } : app))
    );
    showToast(`Candidate stage updated to: ${stage}`, "success");

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
