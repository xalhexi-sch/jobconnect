"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Job, Application, RoleType, UserProfile } from "@/lib/types";
import { INITIAL_USER_PROFILE } from "@/lib/mock-data";
import { DEFAULT_MOCK_USER, MockUser } from "@/lib/clerk";
import { fetchJobsAction, createJobAction, fetchMyJobsAction, setMyJobStatusAction } from "@/app/actions/jobs";
import {
  submitApplicationAction,
  updateApplicationStatusAction,
  fetchUserApplicationsAction,
} from "@/app/actions/applications";
import {
  saveUserProfileAction,
  fetchUserProfileAction,
  completeOnboardingAction,
  fetchSavedJobIdsAction,
  toggleSavedJobAction,
} from "@/app/actions/profile";
import { uploadResumeAction } from "@/app/actions/resume";
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

export interface OnboardingInput {
  role: "jobseeker" | "employer";
  fullName: string;
  phone?: string;
  location?: string;
  headline?: string;
  companyName?: string;
  companyIndustry?: string;
}

interface AppContextType {
  /** Server-verified role. Changing it requires the server; the client cannot set it. */
  role: RoleType;
  user: MockUser;
  setUser: React.Dispatch<React.SetStateAction<MockUser>>;
  userProfile: UserProfile;
  profileLoaded: boolean;
  /** Set when the signed-in user's profile could not be loaded; show a retry, not onboarding. */
  profileError: string | null;
  retryProfile: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (input: OnboardingInput) => Promise<boolean>;
  uploadResume: (file: File) => Promise<boolean>;
  jobs: Job[];
  jobsLoading: boolean;
  applications: Application[];
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
  applyToJob: (job: Job, options?: ApplyOptions | string) => Promise<boolean>;
  postJob: (newJob: Omit<Job, "id" | "postedDate" | "appliedCount" | "status">) => Promise<boolean>;
  updateJobStatus: (id: string, status: "Active" | "Expired") => void;
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
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isSignedIn: boolean;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<RoleType>("jobseeker");
  const [user, setUser] = useState<MockUser>(DEFAULT_MOCK_USER);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<string[]>([]);
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
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800);
  }, []);

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const reloadJobs = useCallback(async (userRole: RoleType, signedIn: boolean) => {
    const publicJobs = await fetchJobsAction();
    if (signedIn) {
      const mine = await fetchMyJobsAction();
      if (mine.ok) {
        const mineIds = new Set(mine.jobs.map((j) => j.id));
        setJobs([...mine.jobs, ...publicJobs.filter((j) => !mineIds.has(j.id))]);
        return;
      }
    }
    setJobs(publicJobs);
  }, []);

  // Server-trusted session data: profile (incl. role), applications, saved jobs
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user.id) {
        await Promise.resolve();
        if (!mounted) return;
        setProfileLoaded(false);
        setProfileError(null);
        setApplications([]);
        setBookmarkedJobIds([]);
        setUserProfile(INITIAL_USER_PROFILE);
        setRole("jobseeker");
        await reloadJobs("jobseeker", false);
        if (mounted) setJobsLoading(false);
        return;
      }

      const res = await fetchUserProfileAction();
      if (!mounted) return;
      if (!res.ok || !res.profile) {
        // Lookup failed (or session not ready): never treat this as a brand-new user. Offer retry, keep browsing working.
        setProfileError(res.ok ? "We couldn’t find your account yet." : res.error);
        setProfileLoaded(true);
        await reloadJobs("jobseeker", false);
        if (mounted) setJobsLoading(false);
        return;
      }
      const profile = res.profile;
      setProfileError(null);
      const serverRole = profile.role ?? "jobseeker";
      setUserProfile(profile);
      setRole(serverRole);
      setProfileLoaded(true);
      if (!profile.onboarded) setIsOnboardingOpen(true);

      const [apps, saved] = await Promise.all([fetchUserApplicationsAction(), fetchSavedJobIdsAction()]);
      if (!mounted) return;
      if (apps.ok) setApplications(apps.applications);
      setBookmarkedJobIds(saved);
      await reloadJobs(serverRole, true);
      if (mounted) setJobsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [user.id, reloadJobs, retryNonce]);

  const openAuthModal = (mode: "sign-in" | "sign-up" = "sign-in") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => setIsAuthOpen(false);

  const logoutUser = () => {
    setIsSignedIn(false);
    setUser(DEFAULT_MOCK_USER);
    showToast("Signed out", "info");
  };

  const completeOnboarding = async (input: OnboardingInput) => {
    const res = await completeOnboardingAction(input);
    if (!res.ok) {
      showToast(res.error, "warning");
      return false;
    }
    setUserProfile(res.profile);
    setRole(res.profile.role ?? "jobseeker");
    setUser((prev) => ({ ...prev, role: res.profile.role ?? "jobseeker", fullName: res.profile.fullName }));
    reloadJobs(res.profile.role ?? "jobseeker", true);
    return true;
  };

  const uploadResume = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadResumeAction(fd);
    if (!res.ok) {
      showToast(res.error, "warning");
      return false;
    }
    setUserProfile((prev) => ({ ...prev, resumeFileName: res.fileName }));
    showToast("Resume uploaded", "success");
    return true;
  };

  const updateUserProfile = (updatedFields: Partial<UserProfile>) => {
    const previous = userProfile;
    setUserProfile((prev) => ({ ...prev, ...updatedFields }));
    saveUserProfileAction(updatedFields).then((res) => {
      if (res.ok) {
        setUserProfile(res.profile);
        showToast("Profile updated successfully!", "success");
      } else {
        setUserProfile(previous);
        showToast(res.error, "warning");
      }
    });
    setIsResumeModalOpen(false);
  };

  const toggleBookmark = (jobId: string) => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    const exists = bookmarkedJobIds.includes(jobId);
    setBookmarkedJobIds((prev) => (exists ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
    toggleSavedJobAction(jobId, !exists).then((res) => {
      if (!res.ok) {
        setBookmarkedJobIds((prev) => (exists ? [...prev, jobId] : prev.filter((id) => id !== jobId)));
        showToast(res.error, "warning");
      } else {
        showToast(exists ? "Removed from saved jobs" : "Saved to your bookmarks!", "info");
      }
    });
  };

  const applyToJob = async (job: Job, options?: ApplyOptions | string) => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return false;
    }
    const opts = typeof options === "object" ? options : undefined;
    const coverNote = typeof options === "string" ? options : opts?.coverNote;

    const res = await submitApplicationAction({
      jobId: job.id,
      applicantName: opts?.applicantName || undefined,
      applicantEmail: opts?.applicantEmail || undefined,
      phone: opts?.phone || undefined,
      coverLetter: coverNote || undefined,
    });

    if (!res.ok) {
      showToast(res.error, "warning");
      if (res.error.toLowerCase().includes("profile") || res.error.toLowerCase().includes("onboard")) {
        setApplyModalJob(null);
        setIsOnboardingOpen(true);
      }
      return false;
    }

    setApplications((prev) => [res.application, ...prev]);
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, appliedCount: j.appliedCount + 1 } : j)));
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {
      // decorative only
    }
    showToast(`Application sent to ${job.company}!`, "success");
    setApplyModalJob(null);
    return true;
  };

  const postJob = async (newJobData: Omit<Job, "id" | "postedDate" | "appliedCount" | "status">) => {
    const res = await createJobAction(newJobData);
    if (!res.ok) {
      showToast(res.error, "warning");
      if (res.error.toLowerCase().includes("profile") || res.error.toLowerCase().includes("onboard")) {
        setIsPostJobOpen(false);
        setIsOnboardingOpen(true);
      }
      return false;
    }
    setJobs((prev) => [res.job, ...prev]);
    showToast(
      res.job.status === "Active"
        ? `"${res.job.title}" is now live!`
        : `"${res.job.title}" submitted. It goes live once an admin approves your business.`,
      res.job.status === "Active" ? "success" : "info"
    );
    setIsPostJobOpen(false);
    return true;
  };

  const updateJobStatus = async (id: string, status: "Active" | "Expired") => {
    const res = await setMyJobStatusAction(id, status);
    if (!res.ok) {
      showToast(res.error, "warning");
      return;
    }
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    showToast(`Job listing marked as ${status}`, "info");
  };

  const updateApplicationStage = async (appId: string, stage: Application["status"]) => {
    const previous = applications;
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: stage } : a)));
    const res = await updateApplicationStatusAction(appId, stage);
    if (!res.ok) {
      setApplications(previous);
      showToast(res.error, "warning");
      return;
    }
    showToast(`Candidate stage moved to: ${stage}`, "success");
  };

  return (
    <AppContext.Provider
      value={{
        role,
        user,
        setUser,
        userProfile,
        profileLoaded,
        profileError,
        retryProfile: () => setRetryNonce((n) => n + 1),
        updateUserProfile,
        completeOnboarding,
        uploadResume,
        jobs,
        jobsLoading,
        applications,
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
        isOnboardingOpen,
        setIsOnboardingOpen,
        isSignedIn,
        setIsSignedIn,
        logoutUser,
        toasts,
        showToast,
        removeToast,
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
