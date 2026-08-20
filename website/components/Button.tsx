import type { AnchorHTMLAttributes, ReactNode } from "react";

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function ButtonPrimary({ children, ...props }: AnchorProps & { children: ReactNode }) {
  return (
    <a className="btn btn-primary" {...props}>
      {children}
    </a>
  );
}

export function ButtonSecondary({ children, ...props }: AnchorProps & { children: ReactNode }) {
  return (
    <a className="btn btn-secondary" {...props}>
      {children}
    </a>
  );
}

export function TextLink({
  children,
  plain,
  ...props
}: AnchorProps & { children: ReactNode; plain?: boolean }) {
  return (
    <a className={`text-link${plain ? " text-link-plain" : ""}`} {...props}>
      {children}
    </a>
  );
}
