'use client';

import useOtherUser from '@/hooks/useOtherUser';
import { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import React, { useState } from 'react';
import UserAvatar from '../UserAvatar';
import { MoreHorizontal, MoveLeft } from 'lucide-react';
import ProfileDrawer from './ProfileDrawer';

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

export default function ChatRoomHeader({ conversation }: HeaderProps) {
  const otherUser = useOtherUser(conversation);
  // const [drawerOpen, setDrawerOpen] = useState(false);

  console.log('conversation name: ', conversation);

  // const { members } = useActiveList();
  // const isActive = members.indexOf(otherUser?.email!) !== -1;
  // const statusText = useMemo(() => {
  //   if (conversation.isGroup) {
  //     return `${conversation.users.length} members`;
  //   }
  //
  //   return isActive ? 'Active' : 'Offline'
  // }, [conversation, isActive]);

  return (
    <>
      {/*<ProfileDrawer*/}
      {/*  data={conversation}*/}
      {/*  isOpen={drawerOpen}*/}
      {/*  onClose={() => setDrawerOpen(false)}*/}
      {/*/>*/}
      <div className="flex w-full items-center justify-between border-b-[1px] bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="block cursor-pointer text-slate-500 transition hover:text-sky-600 lg:hidden"
          >
            <MoveLeft size={24} />
          </Link>
          {conversation.isGroup ? (
            // <AvatarGroup users={conversation.users} />
            <>TODO: 아바타그룹</>
          ) : (
            <UserAvatar avatarUrl={otherUser.image} />
          )}
          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {/*{statusText}*/}
              상태 메세지
            </div>
          </div>
        </div>

        <ProfileDrawer data={conversation} />

        {/* <MoreHorizontal
          size={24}
          onClick={() => setDrawerOpen(true)}
          className="cursor-pointer text-slate-500 transition hover:text-sky-600"
        /> */}
      </div>
    </>
  );
}
