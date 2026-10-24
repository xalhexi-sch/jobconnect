"use client";

import { useState } from "react";
import { initials } from "@/lib/format";

/** Company logo with a graceful initials fallback when the image is missing or fails to load. */
export default function CompanyLogo({
  name,
  src,
  size = 48,
  className = "",
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={`shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2 flex items-center justify-center font-bold text-brand ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden={!showImage}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
