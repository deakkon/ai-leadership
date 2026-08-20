import type { ReactNode } from "react";

export default function Stat({
  value,
  caption,
}: {
  value: ReactNode;
  caption: ReactNode;
}) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-caption">{caption}</span>
    </div>
  );
}
