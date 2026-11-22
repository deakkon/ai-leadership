import AgencyHome from "../components/AgencyHome";
import { pageMetadata, brand } from "../lib/agency";
export const metadata = pageMetadata(
  "AI strategy & software engineering in Berlin",
  brand.description,
  "/",
);
export default function Home() {
  return <AgencyHome />;
}
