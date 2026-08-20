/* Printed masthead dateline — no live-monitoring device. The plain em-dash
   is the printed separator between dateline and locale. */
export default function StatusLine({ text }: { text: string }) {
  return (
    <span className="status-line">
      {text}
      <span aria-hidden="true">—</span>
    </span>
  );
}
