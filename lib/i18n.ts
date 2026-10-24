"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Locale = "en" | "fil";

const en = {
  apply: "Apply",
  applied: "Applied",
  save: "Save",
  saved: "Saved",
  featured: "Featured",
  awaitingApproval: "Awaiting approval",
  findJobs: "Find jobs",
  applications: "Applications",
  profile: "Profile",
  searchPlaceholder: "Search job title, company or place…",
  anySetup: "Any setup",
  job: "job",
  jobs: "jobs",
  noMatchTitle: "No jobs match your search",
  noMatchHint: "Try a different keyword or clear the filters.",
  noJobsTitle: "No openings yet",
  noJobsHint: "New vacancies from Butuan employers will show up here.",
  clearFilters: "Clear filters",
  myApplications: "My applications",
  noAppsTitle: "You haven’t applied yet",
  noAppsHint: "Browse open roles in Butuan and tap Apply to send your details straight to the employer.",
  browseJobs: "Browse jobs",
  withdraw: "Withdraw",
  savedJobs: "Saved jobs",
  noSavedTitle: "Nothing saved yet",
  noSavedHint: "Tap the bookmark on any job to keep it here for later.",
  applyNow: "Apply now",
  signInToApply: "Sign in to apply",
  applicationSubmitted: "Application submitted",
  notAccepting: "Not accepting applications",
  openPage: "Open page",
  aboutRole: "About the role",
  requirements: "Requirements",
  directHiring: "Direct hiring, no agency fees",
  sendApplication: "Send application",
  sending: "Sending…",
  cancel: "Cancel",
  fullName: "Full name",
  email: "Email",
  mobile: "Mobile number",
  resume: "Resume",
  coverNote: "Cover note",
  optional: "optional",
  latestOpportunities: "Latest opportunities",
  latestHint: "Real jobs from Butuan City and Caraga employers. Apply directly, no agency fees.",
  seeAll: "See all",
  openPortal: "Open the job portal",
  signIn: "Sign in",
  language: "Language",
} as const;

export type MessageKey = keyof typeof en;

const fil: Record<MessageKey, string> = {
  apply: "Mag-apply",
  applied: "Naka-apply na",
  save: "I-save",
  saved: "Naka-save",
  featured: "Tampok",
  awaitingApproval: "Naghihintay ng pag-apruba",
  findJobs: "Maghanap ng trabaho",
  applications: "Mga aplikasyon",
  profile: "Profile",
  searchPlaceholder: "Maghanap ng trabaho, kumpanya o lugar…",
  anySetup: "Kahit anong setup",
  job: "trabaho",
  jobs: "trabaho",
  noMatchTitle: "Walang trabahong tugma sa hanap mo",
  noMatchHint: "Subukan ang ibang salita o alisin ang mga filter.",
  noJobsTitle: "Wala pang bakante",
  noJobsHint: "Lalabas dito ang mga bagong bakante mula sa mga employer sa Butuan.",
  clearFilters: "Alisin ang mga filter",
  myApplications: "Mga aplikasyon ko",
  noAppsTitle: "Wala ka pang inaapplyan",
  noAppsHint: "Mag-browse ng bakante sa Butuan at pindutin ang Mag-apply para direktang maipadala ang detalye mo sa employer.",
  browseJobs: "Mag-browse ng trabaho",
  withdraw: "Bawiin",
  savedJobs: "Mga naka-save na trabaho",
  noSavedTitle: "Wala pang naka-save",
  noSavedHint: "Pindutin ang bookmark sa kahit anong trabaho para itago ito rito.",
  applyNow: "Mag-apply ngayon",
  signInToApply: "Mag-sign in para mag-apply",
  applicationSubmitted: "Naipadala na ang aplikasyon",
  notAccepting: "Hindi na tumatanggap ng aplikasyon",
  openPage: "Buksan ang pahina",
  aboutRole: "Tungkol sa trabaho",
  requirements: "Mga kailangan",
  directHiring: "Direktang pag-hire, walang bayad sa agency",
  sendApplication: "Ipadala ang aplikasyon",
  sending: "Ipinapadala…",
  cancel: "Kanselahin",
  fullName: "Buong pangalan",
  email: "Email",
  mobile: "Numero ng cellphone",
  resume: "Resume",
  coverNote: "Maikling mensahe",
  optional: "opsyonal",
  latestOpportunities: "Mga pinakabagong oportunidad",
  latestHint: "Totoong trabaho mula sa mga employer sa Butuan City at Caraga. Direktang mag-apply, walang bayad sa agency.",
  seeAll: "Tingnan lahat",
  openPortal: "Buksan ang job portal",
  signIn: "Mag-sign in",
  language: "Wika",
};

const MESSAGES: Record<Locale, Record<MessageKey, string>> = { en, fil };

const subscribe = (cb: () => void) => {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  return () => obs.disconnect();
};
const getLocale = (): Locale => (document.documentElement.lang === "fil" ? "fil" : "en");

/** Locale lives on <html lang> (set before paint by the layout script) and in localStorage. */
export function useT() {
  const locale = useSyncExternalStore(subscribe, getLocale, () => "en" as Locale);

  const t = useCallback((key: MessageKey) => MESSAGES[locale][key], [locale]);

  const setLocale = useCallback((next: Locale) => {
    document.documentElement.lang = next;
    try {
      localStorage.setItem("locale", next);
    } catch {
      // storage unavailable: applies for this visit only
    }
  }, []);

  return { t, locale, setLocale, intlLocale: locale === "fil" ? "fil-PH" : "en" };
}
