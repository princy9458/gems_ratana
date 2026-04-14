"use client";
import { usePathname } from "next/navigation";
import GemSiteChrome from "./GemSiteChrome";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <>{children}</>;
  }

  // If we are in the admin panel or on auth pages, do not render the storefront header and footer
  if (
    pathname?.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/signup"
  ) {
    return <>{children}</>;
  }

  // Otherwise, wrap children in the standard gemsratna header and footer
  return <GemSiteChrome>{children}</GemSiteChrome>;
}
