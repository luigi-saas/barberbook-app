import type { ReactNode } from "react";

/**
 * Pass-through root layout. The real `<html>`/`<body>` markup is rendered by
 * `app/[locale]/layout.tsx`. This layout exists only so the localeless root
 * page (`app/page.tsx`) can live outside `[locale]` without Next.js
 * complaining about a missing root layout.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
