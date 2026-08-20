import type { MetadataRoute } from "next";
import { withBase } from "../lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dr. Jurica Ševa — Fractional Chief AI Officer",
    short_name: "Dr. Jurica Ševa",
    description:
      "Fractional CAIO, VP and Head-of-AI leadership for companies moving GenAI, agentic AI and AI platforms from strategy to production.",
    start_url: withBase("/"),
    display: "standalone",
    background_color: "#f5f2ea",
    theme_color: "#f5f2ea",
    icons: [
      { src: withBase("/icon.svg"), sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: withBase("/apple-icon.png"), sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
