import { identity } from "../lib/site";

export default function AuthorCard({ updatedAt }: { updatedAt: string }) {
  return (
    <div className="author-card">
      <div className="author-avatar" aria-hidden="true">
        Š
      </div>
      <div>
        <h3>{identity.name}</h3>
        <p className="meta">Fractional CAIO · PhD (Univ. of Zagreb) · Berlin</p>
        <p>
          Executive AI leadership with the technical depth to take strategy into production —
          strategy, architecture, engineering and organizational leadership in one accountable role.
        </p>
        <p className="tags">
          <span className="tag">
            <a href={identity.linkedinUrl} target="_blank" rel="noopener">
              LinkedIn
            </a>
          </span>
        </p>
        <p className="meta">Last updated {updatedAt}</p>
      </div>
    </div>
  );
}
