import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { siteUrl, withBase } from "../lib/site";
import Footer from "../components/Footer";
import Masthead from "../components/Masthead";
import MotionConfigProvider from "../components/MotionConfigProvider";
import SkipLink from "../components/SkipLink";
import TopicBackground from "../components/TopicBackground";

/* Pre-paint theme boot: runs synchronously during HTML parse, before first
   paint, so the page never flashes the wrong theme. Stored choice wins;
   otherwise the OS preference decides; otherwise light — Newsprint, the site
   default (dark is the Forge theme). SSR always renders data-theme="light"
   and the script corrects it before hydration. The browser chrome
   (theme-color meta) is set from the same resolved theme so dark-mode
   mobile chrome stays Forge charcoal, not newsprint. */
const themeBootScript = `(function(){try{var t=localStorage.getItem("folio.theme");if(t!=="dark"&&t!=="light"){t=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light";}document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute("content",t==="dark"?"#141519":"#f5f2ea");}}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dr. Jurica Ševa | Fractional Chief AI Officer & AI Transformation Executive",
    template: "%s — Dr. Jurica Ševa",
  },
  description:
    "Fractional CAIO, VP and Head-of-AI leadership for companies moving GenAI, agentic AI and AI platforms from strategy to production. AI systems that make it to production.",
  icons: { icon: withBase("/icon.svg"), apple: withBase("/apple-icon.png") },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Dr. Jurica Ševa — AI Transformation & Engineering Executive",
    description:
      "Executive AI strategy, engineering leadership and production architecture in one engagement.",
    siteName: "Dr. Jurica Ševa",
    images: [{ url: `${siteUrl}/og.png` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Jurica Ševa — AI Transformation & Engineering Executive",
    description:
      "Executive AI strategy, engineering leadership and production architecture in one engagement.",
    images: [`${siteUrl}/og.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Light SSR default; the boot script and applyTheme sync the meta to the
     resolved theme (dark chrome = Forge charcoal). */
  themeColor: "#f5f2ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`theme-folio ${fontVariables}`}>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <MotionConfigProvider>
          <TopicBackground />
          <SkipLink />
          <Masthead />
          {children}
          <Footer />
        </MotionConfigProvider>
      </body>
    </html>
  );
}
