'use client';

import useRoutes from '@/hooks/useRoutes';
import React from 'react';
import DesktopNavItem from './DesktopNavItem';
import UserAvatar from '../UserAvatar';
import { useSession } from 'next-auth/react';
import { ModeToggle } from '../ModeToggle';
import { useModal } from '@/hooks/useModal';

export default function DesktopSidebar() {
  const routes = useRoutes();
  const { data: session } = useSession();
  const { onOpen } = useModal();

  return (
    <aside
      className="hidden lg:justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20
                  lg:flex-col lg:overflow-y-auto lg:border-r-[1px] lg:bg-white dark:lg:bg-slate-800 lg:pb-4 xl:px-6"
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
              handler={item.handler}
            />
          ))}
        </ul>
      </nav>

      <nav className="mt-4 flex flex-col items-center justify-between space-y-4">
        <ModeToggle />

        <div
          onClick={() => onOpen('setting')}
          className="cursor-pointer transition hover:opacity-75"
        >
          <UserAvatar avatarUrl={session?.user.image} user={session?.user} />
        </div>
      </nav>
    </aside>
  );
}
