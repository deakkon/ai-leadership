export default function TOC({ items }: { items: { id: string; heading: string }[] }) {
  return (
    <nav className="toc" aria-label="Table of contents">
      {items.map((item, i) => (
        <a key={item.id} href={`#${item.id}`}>
          <span className="toc-num">{String(i + 1).padStart(2, "0")}</span>
          <span>{item.heading}</span>
        </a>
      ))}
    </nav>
  );
}
