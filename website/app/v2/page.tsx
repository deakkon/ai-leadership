import RetiredPreview from "../../components/RetiredPreview";
import { pageMetadata } from "../../lib/agency";
export const metadata = {
  ...pageMetadata(
    "Page moved",
    "Continue to the main Hooman in the Loop site.",
    "/",
  ),
  robots: { index: false, follow: true },
};
export default function Page() {
  return <RetiredPreview path="/" />;
}
