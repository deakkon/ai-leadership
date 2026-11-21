import type { MetadataRoute } from "next";
import { withBase } from "../lib/site";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest { return {
  name: "Hooman in the Loop", short_name: "HITL", description: "Human-led, agent-assisted software engineering.",
  start_url: withBase("/"), display: "standalone", background_color: "#f8faf7", theme_color: "#f8faf7",
  icons: [{ src: withBase("/agency-icon.svg"), sizes: "any", type: "image/svg+xml", purpose: "any" }],
}; }
