import type { Metadata } from "next";

// Ownership tokens are public metadata, configured only after the owner obtains them.
export function searchVerification(
  google?: string,
  bing?: string,
): Metadata["verification"] {
  const googleToken = google?.trim();
  const bingToken = bing?.trim();
  return {
    ...(googleToken ? { google: googleToken } : {}),
    ...(bingToken ? { other: { "msvalidate.01": bingToken } } : {}),
  };
}
