import type { ReactNode } from "react";

export default function PullQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="pullquote-block">
      <blockquote className="pullquote">{children}</blockquote>
      {cite && <figcaption className="pullquote-cite">{cite}</figcaption>}
    </figure>
  );
}
