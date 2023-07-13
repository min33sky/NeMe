'use client';

import useRoutes from '@/hooks/useRoutes';
import React from 'react';
import DesktopNavItem from './DesktopNavItem';
import UserAvatar from '../UserAvatar';
import { useSession } from 'next-auth/react';

export default function DesktopSidebar() {
  const routes = useRoutes();
  const { data: session } = useSession();

  return (
    <aside
      className="hidden lg:justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20
                  lg:flex-col lg:overflow-y-auto lg:border-r-[1px] lg:bg-white lg:pb-4 xl:px-6"
    >
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((item) => (
            <DesktopNavItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
            />
          ))}
        </ul>
      </nav>

      <nav className="mt-4 flex flex-col items-center justify-between">
        <div
          // onClick={() => setIsOpen(true)}
          className="cursor-pointer transition hover:opacity-75"
        >
          <UserAvatar avatarUrl={session?.user.image} />
        </div>
      </nav>
    </aside>
  );
}
