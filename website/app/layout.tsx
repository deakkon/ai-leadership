import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { siteUrl, withBase } from "../lib/site";
import Footer from "../components/Footer";
import Masthead from "../components/Masthead";
import MotionConfigProvider from "../components/MotionConfigProvider";
import SkipLink from "../components/SkipLink";
import "./agency.css";

/* Pre-paint theme boot: runs synchronously during HTML parse, before first
   paint, so the page never flashes the wrong theme. Stored choice wins;
   otherwise the OS preference decides; otherwise light — Newsprint, the site
   default (dark is the Forge theme). SSR always renders data-theme="light"
   and the script corrects it before hydration. The browser chrome
   (theme-color meta) is set from the same resolved theme so dark-mode
   mobile chrome stays Forge charcoal, not newsprint. */
const themeBootScript = `(function(){try{var t=localStorage.getItem("folio.theme");if(t!=="dark"&&t!=="light"){t=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light";}document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute("content",t==="dark"?"#13271f":"#f8faf7");}}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl + "/"),
  title: { default: "Hooman in the Loop | AI-first software agency, Berlin", template: "%s | Hooman in the Loop" },
  description: "Founder-led software engineering, AI automation and fractional AI / CTO leadership for B2B startups and European SMEs.",
  icons: { icon: withBase("/agency-icon.svg"), apple: withBase("/apple-icon.png") },
  openGraph: { type: "website", url: siteUrl + "/", siteName: "Hooman in the Loop", images: [{ url: `${siteUrl}/agency-og.png`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: [`${siteUrl}/agency-og.png`] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Light SSR default; the boot script and applyTheme sync the meta to the
     resolved theme (dark chrome = Forge charcoal). */
  themeColor: "#f8faf7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`theme-folio ${fontVariables}`}>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
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
