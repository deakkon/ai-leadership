import type { ReactNode } from "react";

export default function Figure({
  media,
  caption,
  credit,
  shape,
}: {
  media: ReactNode;
  caption: string;
  credit?: string;
  shape?: "wide" | "square";
}) {
  return (
    <figure className="figure">
      <div className="figure-media" data-shape={shape} aria-label={caption}>
        {media}
      </div>
      <figcaption className="figure-folio">
        <span>{caption}</span>
        {credit && <span>{credit}</span>}
      </figcaption>
    </figure>
  );
}
