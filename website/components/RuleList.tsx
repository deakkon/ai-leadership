import type { ReactNode } from "react";

export function RuleList({ children }: { children: ReactNode }) {
  return <div className="rule-list">{children}</div>;
}

export function RuleRow({
  label,
  children,
}: {
  label?: ReactNode;
  children: ReactNode;
}) {
  if (!label) {
    return (
      <div className="rule-row rule-row-plain">
        <div className="rule-body">{children}</div>
      </div>
    );
  }
  return (
    <div className="rule-row">
      <span className="rule-label">{label}</span>
      <div className="rule-body">{children}</div>
    </div>
  );
}
