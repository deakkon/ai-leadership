import type { ReactNode } from "react";

export type LedgerStatus = "operational" | "limited" | "nda";

export type LedgerRow = {
  status?: LedgerStatus;
  cell: ReactNode;
  detail?: ReactNode;
  meta?: string;
};

const statusGlyph: Record<LedgerStatus, { glyph: string; cls: string; label: string }> = {
  operational: { glyph: "●", cls: "status-ok", label: "operational" },
  limited: { glyph: "◐", cls: "status-limited", label: "limited" },
  nda: { glyph: "○", cls: "status-nda", label: "under NDA" },
};

export default function Ledger({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: LedgerRow[];
}) {
  return (
    <div className="ledger-wrap">
      <table className="ledger">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.status && (
                <td className="mono">
                  <span className={`status-dot-glyph ${statusGlyph[row.status].cls}`} title={statusGlyph[row.status].label}>
                    {statusGlyph[row.status].glyph}
                  </span>
                </td>
              )}
              <td>{row.cell}</td>
              {row.detail && <td className="mono">{row.detail}</td>}
              <td className="mono">{row.meta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
