import type { ReactNode } from "react";
import HairlineDraw from "./HairlineDraw";

export default function SectionHeader({
  index,
  eyebrow,
  title,
  lead,
  leadClassName,
  drawHairline = false,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  leadClassName?: string;
  drawHairline?: boolean;
}) {
  return (
    <header className="section-head">
      <div className="rail">
        {index && <span className="folio-num">{index}</span>}
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <h2>{title}</h2>
      {lead && (
        <p className={`lead${leadClassName ? ` ${leadClassName}` : ""}`} style={{ marginTop: "var(--sp-4)" }}>
          {lead}
        </p>
      )}
      {drawHairline && <HairlineDraw />}
    </header>
  );
}
