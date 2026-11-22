import { notFound } from "next/navigation";
import { packages, pageMetadata } from "../../../../lib/agency";
import RetiredPreview from "../../../../components/RetiredPreview";
export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    ...pageMetadata(
      "Page moved",
      "Continue to the main site.",
      `/services/${slug}/`,
    ),
    robots: { index: false, follow: true },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!packages.some((p) => p.slug === slug)) notFound();
  return <RetiredPreview path={`/services/${slug}/`} />;
}
