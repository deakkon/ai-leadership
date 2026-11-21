"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { basePath } from "../lib/site-config";
import Masthead from "./Masthead";
import Footer from "./Footer";

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const path =
    pathname === basePath || pathname.startsWith(basePath + "/")
      ? pathname.slice(basePath.length)
      : pathname;
  const preview = path === "/v2" || path.startsWith("/v2/");
  return (
    <>
      {!preview && <Masthead />}
      {children}
      {!preview && <Footer />}
    </>
  );
}
