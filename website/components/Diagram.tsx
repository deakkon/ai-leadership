import type { DiagramSpec } from "../lib/mandates";

const W = 800;
const ROW_H = 64;
const LABEL_W = 220;
const PAD = 16;
const RAIL_W = 28;

function wrapWords(text: string, max = 18) {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= max) {
      cur = (cur + " " + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > 2) {
    const first = lines[0];
    const rest = lines.slice(1).join(" ");
    return [first, rest.length > max ? rest.slice(0, max - 1).trimEnd() + "…" : rest];
  }
  return lines;
}

export default function Diagram({ spec }: { spec: DiagramSpec }) {
  const rows = spec.rows;
  const innerW = W - PAD * 2 - RAIL_W;
  const bodyW = innerW - LABEL_W;
  const H = PAD * 2 + rows.length * ROW_H;

  return (
    <div className="diagram">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.caption}>
        {spec.rail && (
          <text
            x={RAIL_W / 2}
            y={H / 2}
            transform={`rotate(-90 ${RAIL_W / 2} ${H / 2})`}
            textAnchor="middle"
            fontSize="10"
            letterSpacing="2"
            style={{ fontFamily: "var(--font-mono)", fill: "var(--tech)" }}
          >
            {spec.rail}
          </text>
        )}
        {/* hairline grid */}
        {rows.map((_, r) => {
          const y = PAD + r * ROW_H;
          return (
            <g key={r}>
              <line x1={PAD + RAIL_W} y1={y} x2={W - PAD} y2={y} style={{ stroke: "var(--line)" }} strokeWidth="1" />
              <line x1={PAD + RAIL_W} y1={y + ROW_H} x2={W - PAD} y2={y + ROW_H} style={{ stroke: "var(--line-strong)" }} strokeWidth="1" />
              {rows[r].cells.map((_, c) => {
                const cellW = bodyW / rows[r].cells.length;
                const x = PAD + RAIL_W + LABEL_W + c * cellW;
                return (
                  <line
                    key={c}
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={y + ROW_H}
                    stroke={c === 0 ? "var(--line-strong)" : "var(--line)"}
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          );
        })}
        {/* row labels */}
        {rows.map((row, r) => {
          const y = PAD + r * ROW_H;
          return (
            <g key={`l${r}`}>
              <rect x={PAD + RAIL_W + 2} y={y + ROW_H / 2 - 3} width="6" height="6" style={{ fill: "var(--accent)" }} />
              <text
                x={PAD + RAIL_W + 16}
                y={y + ROW_H / 2 + 4}
                fontSize="11"
                letterSpacing="1"
                style={{ fontFamily: "var(--font-mono)", fill: "var(--muted)" }}
              >
                {row.label.toUpperCase()}
              </text>
            </g>
          );
        })}
        {/* cells */}
        {rows.map((row, r) => {
          const y = PAD + r * ROW_H;
          const cellW = bodyW / row.cells.length;
          return row.cells.map((cell, c) => {
            const x = PAD + RAIL_W + LABEL_W + c * cellW;
            const lines = wrapWords(cell);
            return (
              <g key={`c${r}-${c}`}>
                <rect
                  x={x + 6}
                  y={y + 8}
                  width={cellW - 12}
                  height={ROW_H - 16}
                  style={{ fill: "var(--surface-2)", stroke: "var(--line)" }}
                  strokeWidth="1"
                />
                {lines.map((ln, li) => (
                  <text
                    key={li}
                    x={x + cellW / 2}
                    y={y + ROW_H / 2 + (lines.length === 2 ? (li - 0.5) * 16 : 4)}
                    textAnchor="middle"
                    fontSize="11.5"
                    fontWeight="500"
                    style={{ fontFamily: "var(--font-display)", fill: "var(--ink)" }}
                  >
                    {ln}
                  </text>
                ))}
              </g>
            );
          });
        })}
      </svg>
      <div className="diagram-folio">
        <span>{spec.caption}</span>
        <span>Figure · Folio editorial</span>
      </div>
    </div>
  );
}
