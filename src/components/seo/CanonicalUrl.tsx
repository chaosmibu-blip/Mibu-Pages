"use client";

import { usePathname } from "next/navigation";

const CANONICAL_ORIGIN = "https://mibu-travel.com";

export function CanonicalUrl() {
  const pathname = usePathname();
  return <link rel="canonical" href={`${CANONICAL_ORIGIN}${pathname}`} />;
}
