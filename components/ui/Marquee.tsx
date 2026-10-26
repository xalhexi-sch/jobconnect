import type { ReactNode } from "react";

/** Seamless looping strip; the second copy is hidden from assistive tech. */
export default function Marquee({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="marquee" role="group" aria-label={label}>
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden>{children}</div>
    </div>
  );
}
