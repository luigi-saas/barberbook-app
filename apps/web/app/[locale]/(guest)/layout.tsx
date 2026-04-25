import type { ReactNode } from 'react';
import { GuestNav } from './components/guest-nav';
import { GuestFooter } from './components/guest-footer';

interface GuestLayoutProps {
  readonly children: ReactNode;
}

const GuestLayout = ({ children }: GuestLayoutProps) => (
  <>
    <GuestNav />
    {children}
    <GuestFooter />
  </>
);

export default GuestLayout;
