import type { ReactNode } from "react";

export default function ContentsRow({
  num,
  title,
  href,
  desc,
  meta,
  children,
}: {
  num: string;
  title: string;
  href?: string;
  desc?: string;
  meta?: string;
  children?: ReactNode;
}) {
  const right = meta ? (
    <span className="contents-meta">{meta}</span>
  ) : desc ? (
    <p className="contents-desc">{desc}</p>
  ) : null;

  return (
    <div className="contents-row">
      <span className="idx">{num}</span>
      <div className="contents-main">
        <div className="contents-line">
          <h3>{href ? <a href={href}>{title}</a> : title}</h3>
          {right && (
            <>
              <span className="dot-leader" aria-hidden="true" />
              {right}
            </>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
