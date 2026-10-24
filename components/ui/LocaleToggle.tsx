"use client";

import { useT } from "@/lib/i18n";

export default function LocaleToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useT();
  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "en" ? "fil" : "en")}
      aria-label={`${t("language")}: ${locale === "en" ? "English" : "Filipino"}. Switch to ${locale === "en" ? "Filipino" : "English"}`}
      className={`h-9 px-2.5 rounded-full text-xs font-bold tracking-wide text-neutral-600 hover:text-fg hover:bg-neutral-100 transition-colors cursor-pointer ${className}`}
    >
      {locale === "en" ? "EN" : "FIL"}
    </button>
  );
}
