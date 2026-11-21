import type { Metadata } from "next";
import type { ReactNode } from "react";
import V2Shell from "../../components/V2Shell";
import "./v2.css";

export const metadata: Metadata = { robots: { index: false, follow: true } };
export default function V2Layout({ children }: { children: ReactNode }) {
  return <V2Shell>{children}</V2Shell>;
}
