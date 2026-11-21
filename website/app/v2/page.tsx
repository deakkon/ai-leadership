import V2Home from "../../components/V2Home";
import { pageMetadata } from "../../lib/agency";
export const metadata = pageMetadata(
  "AI strategy & software delivery — V2 preview",
  "Explore an alternative design for Hooman in the Loop: AI strategy, software delivery and hands-on technical leadership.",
  "/v2/",
);
export default function V2() {
  return <V2Home />;
}
