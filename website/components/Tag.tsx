import type { ReactNode } from "react";

export default function Tag({ children, href }: { children: ReactNode; href?: string }) {
  return (
    <span className="tag">
      {href ? <a href={href}>{children}</a> : children}
    </span>
  );
}
