import type { ReactNode } from "react";

export default function Callout({ kicker, children }: { kicker?: string; children: ReactNode }) {
  return (
    <div className="callout">
      {kicker && <span className="callout-kicker">{kicker}</span>}
      <div>{children}</div>
    </div>
  );
}
