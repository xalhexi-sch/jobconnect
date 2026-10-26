"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { useApp } from "@/context/AppContext";
import { Application, ApplicationMessage } from "@/lib/types";
import { fetchApplicationMessagesAction, sendApplicationMessageAction, ChatThreadInfo } from "@/app/actions/messages";
import { Loader2, Send } from "lucide-react";

export default function ApplicationChatModal({
  application,
  onClose,
}: {
  application: Application | null;
  onClose: () => void;
}) {
  const { user, showToast } = useApp();
  const [messages, setMessages] = useState<ApplicationMessage[]>([]);
  const [thread, setThread] = useState<ChatThreadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(
    async (showLoadingSpinner = false) => {
      if (!application?.id) return;
      if (showLoadingSpinner) setLoading(true);

      const res = await fetchApplicationMessagesAction(application.id);
      if (res.ok) {
        setMessages(res.messages);
        setThread(res.thread);
      } else if (showLoadingSpinner) {
        showToast(res.error, "warning");
      }
      if (showLoadingSpinner) setLoading(false);
    },
    [application?.id, showToast]
  );

  // Initial load
  useEffect(() => {
    if (application) {
      loadMessages(true);
    } else {
      setMessages([]);
      setThread(null);
      setContent("");
    }
  }, [application, loadMessages]);

  // Periodic refresh while modal is active
  useEffect(() => {
    if (!application) return;
    const interval = setInterval(() => {
      loadMessages(false);
    }, 4500);
    return () => clearInterval(interval);
  }, [application, loadMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text || !application?.id || sending) return;

    setSending(true);
    const res = await sendApplicationMessageAction({
      applicationId: application.id,
      content: text,
    });

    if (res.ok) {
      setContent("");
      setMessages((prev) => [...prev, res.message]);
    } else {
      showToast(res.error, "warning");
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!application) return null;

  const headerTitle = thread?.otherPartyName || application.applicantName || application.company || "Direct Message";
  const headerSubtitle = `${application.jobTitle} · ${application.company || "JobConnect"}`;

  return (
    <Dialog
      open={Boolean(application)}
      onClose={onClose}
      title={headerTitle}
      description={headerSubtitle}
      size="md"
    >
      <div className="flex flex-col h-[420px] -mx-4 -mb-4 sm:-mx-6 sm:-mb-6">
        {/* Messages Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-surface-2/40">
          {loading ? (
            <div className="h-full flex items-center justify-center text-fg-muted">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-fg-muted space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-line flex items-center justify-center text-blue-600 shadow-xs">
                <Send className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-fg">Direct Application Message</p>
              <p className="text-xs max-w-xs text-fg-muted">
                Connect directly regarding this application, interview details, requirements, or next steps.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user.id;
              const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[85%] ${
                    isMine ? "ml-auto" : "mr-auto"
                  }`}
                >
                  {!isMine && (
                    <span className="text-[11px] font-semibold text-fg-muted mb-1 px-1">
                      {msg.senderName} ({msg.senderRole === "employer" ? "Hirer" : "Applicant"})
                    </span>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? "bg-blue-600 text-white rounded-br-xs shadow-xs"
                        : "bg-surface border border-line text-fg rounded-bl-xs shadow-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-fg-muted/80 mt-1 px-1">{formattedTime}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-surface border-t border-line flex items-center gap-2">
          <input
            type="text"
            className="field flex-1 h-11 text-sm bg-surface-2 focus:bg-surface"
            placeholder={`Message ${thread?.otherPartyName || "here"}...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            maxLength={2000}
            autoFocus
          />
          <button
            type="submit"
            disabled={!content.trim() || sending}
            className="btn-brand-primary h-11 px-4 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-40"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </Dialog>
  );
}
