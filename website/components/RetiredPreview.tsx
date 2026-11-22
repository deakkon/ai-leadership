import { withBase } from "../lib/site-config";
export default function RetiredPreview({ path }: { path: string }) {
  const href = withBase(path);
  return (
    <main id="main" className="v2-main v2-detail">
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <h1>The new site has moved.</h1>
      <p>
        <a href={href}>Continue to the main site</a>
      </p>
    </main>
  );
}
