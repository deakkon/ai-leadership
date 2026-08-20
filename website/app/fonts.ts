import { IBM_Plex_Mono, Newsreader } from "next/font/google";

export const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

export const newsreaderItalic = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: "italic",
  variable: "--font-display-italic",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${newsreader.variable} ${newsreaderItalic.variable} ${plexMono.variable}`;
