import type { ReactNode } from "react";

interface LegalLayoutProps {
  children: ReactNode;
}

/**
 * The BaseHub Toolbar (inline CMS editing) only works with a token — without
 * one it throws at render. Skip it entirely in tokenless deployments.
 */
const LegalLayout = ({ children }: LegalLayoutProps) => <>{children}</>;

export default LegalLayout;
