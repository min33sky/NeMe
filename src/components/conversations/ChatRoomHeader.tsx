'use client';

import useOtherUser from '@/hooks/useOtherUser';
import { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import UserAvatar from '../UserAvatar';
import { MoreHorizontal, MoveLeft } from 'lucide-react';
import ProfileDrawer from './ProfileDrawer';
import AvatarGroup from '../AvatarGroup';
import useActiveList from '@/hooks/useActiveList';

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

export default function ChatRoomHeader({ conversation }: HeaderProps) {
  const otherUser = useOtherUser(conversation);

  const { members } = useActiveList();

  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length}명 참여중`;
    }

    return isActive ? '접속중' : '오프라인';
  }, [conversation, isActive]);

  return (
    <>
      <div className="flex w-full items-center justify-between border-b-[1px] bg-white dark:bg-slate-900 px-4 py-3 shadow-sm sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="block cursor-pointer text-slate-500 transition hover:text-sky-600 lg:hidden"
          >
            <MoveLeft size={24} />
          </Link>

          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <UserAvatar avatarUrl={otherUser.image} user={otherUser} />
          )}

          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>

        <ProfileDrawer data={conversation} />
      </div>
    </>
  );
}
