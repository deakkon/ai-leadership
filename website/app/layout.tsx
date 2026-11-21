import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl, withBase } from "../lib/site";
import Footer from "../components/Footer";
import Masthead from "../components/Masthead";
import MotionConfigProvider from "../components/MotionConfigProvider";
import SkipLink from "../components/SkipLink";
import "./agency.css";

import { organizationSchema, personSchema } from "../lib/schema";
import { searchVerification } from "../lib/search-verification";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl + "/"),
  verification: searchVerification(
    process.env.GOOGLE_SITE_VERIFICATION,
    process.env.BING_SITE_VERIFICATION,
  ),
  title: {
    default: "Hooman in the Loop | AI-first software agency, Berlin",
    template: "%s | Hooman in the Loop",
  },
  description:
    "Founder-led software engineering, AI automation and fractional AI / CTO leadership for B2B startups and European SMEs.",
  icons: {
    icon: withBase("/agency-icon.svg"),
    apple: withBase("/apple-icon.png"),
  },
  openGraph: {
    type: "website",
    url: siteUrl + "/",
    siteName: "Hooman in the Loop",
    images: [{ url: `${siteUrl}/agency-og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${siteUrl}/agency-og.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f9f7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body className="theme-folio">
        {[organizationSchema, personSchema].map((schema) => (
          <script
            key={schema["@type"]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <MotionConfigProvider>
          <SkipLink />
          <Masthead />
          {children}
          <Footer />
        </MotionConfigProvider>
      </body>
    </html>
  );
}
