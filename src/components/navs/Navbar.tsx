import React from 'react';
import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

export default function Navbar() {
  return (
    <>
      {/* Desktop */}
      <DesktopSidebar />
      {/* MObile Footewr */}
      <MobileFooter />
    </>
  );
}
