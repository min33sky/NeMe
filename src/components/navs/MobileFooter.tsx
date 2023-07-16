'use client';

import useRoutes from '@/hooks/useRoutes';
import React from 'react';
import MobileNavItem from './MobileNavItem';
import useAlert from '@/hooks/useAlert';

export default function MobileFooter() {
  const routes = useRoutes();

  // const { isOpen } = useConversation();

  // if (isOpen) {
  //   return null;
  // }

  return (
    <footer className="fixed bottom-0 z-40 flex w-full items-center justify-between border-t-[1px] bg-white lg:hidden">
      {routes.map((route) => (
        <MobileNavItem
          key={route.href}
          href={route.href}
          active={route.active}
          icon={route.icon}
          handler={route.handler}
        />
      ))}
    </footer>
  );
}
