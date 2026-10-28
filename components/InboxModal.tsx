"use client";

import React, { useState, useEffect, useCallback } from "react";
import Dialog from "@/components/ui/Dialog";
import { useApp } from "@/context/AppContext";
import { Application } from "@/lib/types";
import { fetchEmployerApplicationsAction, fetchUserApplicationsAction } from "@/app/actions/applications";
import ApplicationChatModal from "@/components/ApplicationChatModal";
import { Send, Loader2, Building2, User, ArrowUpRight, Briefcase } from "lucide-react";
import Link from "next/link";

export default function InboxModal() {
  const { isInboxOpen, setIsInboxOpen, isSignedIn, openAuthModal, role, applications: candidateApps } = useApp();
  const [loading, setLoading] = useState(false);
  const [chatFor, setChatFor] = useState<Application | null>(null);
  const [threads, setThreads] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "candidate" | "employer">("all");

  const loadThreads = useCallback(async () => {
    if (!isSignedIn) return;
    setLoading(true);
    try {
      const [candRes, empRes] = await Promise.all([
        fetchUserApplicationsAction(),
        role === "employer" || role === "admin"
          ? fetchEmployerApplicationsAction()
          : Promise.resolve({ ok: true as const, applications: [] as Application[] }),
      ]);

      const candList = candRes.ok ? candRes.applications : candidateApps;
      const empList = empRes.ok ? empRes.applications : [];

      // Combine threads without duplicates
      const map = new Map<string, Application>();
      candList.forEach((a) => map.set(a.id, a));
      empList.forEach((a) => map.set(a.id, a));

      setThreads(Array.from(map.values()));
    } catch {
      setThreads(candidateApps);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, role, candidateApps]);

  useEffect(() => {
    if (isInboxOpen && isSignedIn) {
      loadThreads();
    }
  }, [isInboxOpen, isSignedIn, loadThreads]);

  if (!isInboxOpen) return null;

  if (!isSignedIn) {
    return (
      <Dialog
        open={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        title="Direct Messages"
        description="Sign in to view your application direct messages and chats."
        size="sm"
      >
        <div className="py-6 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
          <p className="text-sm text-fg-muted">
            You must be signed in to access your direct inbox messages with employers and applicants.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsInboxOpen(false);
              openAuthModal("sign-in");
            }}
            className="btn-brand-primary w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Sign In to Open Inbox
          </button>
        </div>
      </Dialog>
    );
  }

  const filteredThreads = threads.filter((t) => {
    if (activeTab === "candidate") return !t.employerId || t.employerId !== t.applicantId;
    return true;
  });

  const unreadTotal = threads.filter((t) => t.hasUnreadMessages).length;

  return (
    <>
      <Dialog
        open={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        title="Inbox & Messages"
        description="Direct messaging with employers and candidates regarding job applications."
        size="md"
      >
        <div className="space-y-4">
          {/* Header summary badge */}
          <div className="flex items-center justify-between pb-1 border-b border-line text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-fg">Active Conversations</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px]">
                {threads.length}
              </span>
            </div>
            {unreadTotal > 0 && (
              <span className="flex items-center gap-1.5 text-blue-600 font-semibold text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                {unreadTotal} unread
              </span>
            )}
          </div>

          {/* Threads List */}
          <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-fg-muted">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs">Loading conversations…</span>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-3 rounded-2xl border border-dashed border-line">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-surface-2 flex items-center justify-center text-fg-muted">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-fg">No direct messages yet</h4>
                  <p className="text-xs text-fg-muted max-w-sm mx-auto mt-1">
                    When you apply for a job or when candidates message your vacancies, conversation threads appear here.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/overview"
                    onClick={() => setIsInboxOpen(false)}
                    className="btn-brand-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold"
                  >
                    <span>Browse App Portal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              filteredThreads.map((app) => {
                const partnerName = app.company || app.applicantName || "Direct Chat";
                return (
                  <article
                    key={app.id}
                    onClick={() => setChatFor(app)}
                    className="p-3.5 rounded-xl border border-line bg-surface hover:bg-surface-2 transition-all cursor-pointer flex items-center justify-between gap-3 group relative"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Send className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-fg truncate">{partnerName}</h4>
                          {app.hasUnreadMessages && (
                            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-fg-muted truncate flex items-center gap-1.5">
                          <Briefcase className="w-3 h-3 shrink-0" />
                          <span>{app.jobTitle}</span>
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-fg-muted">
                          <span className="capitalize">{app.status}</span>
                          <span>&bull;</span>
                          <span>{app.appliedDate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatFor(app);
                      }}
                      className="shrink-0 h-8 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                      <span>Chat</span>
                    </button>
                  </article>
                );
              })
            )}
          </div>

          {/* Footer action to full portal */}
          <div className="pt-2 border-t border-line flex items-center justify-between text-xs text-fg-muted">
            <span>Direct candidate &amp; employer messaging</span>
            <Link
              href="/overview"
              onClick={() => setIsInboxOpen(false)}
              className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Open portal view</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Dialog>

      {/* Active Conversation Chat Modal */}
      {chatFor && (
        <ApplicationChatModal
          application={chatFor}
          onClose={() => setChatFor(null)}
        />
      )}
    </>
  );
}
