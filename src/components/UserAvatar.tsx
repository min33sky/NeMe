'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserIcon } from 'lucide-react';
import useActiveList from '@/hooks/useActiveList';
import { User } from '@prisma/client';
import { UserWithId } from '@/types/user';

interface UserAvatarProps {
  avatarUrl: string | null | undefined; //! 아래 user로 대체
  user?: User | UserWithId;
}

export default function UserAvatar({ avatarUrl, user }: UserAvatarProps) {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src={avatarUrl || undefined} alt="@shadcn" />
        <AvatarFallback>
          <UserIcon size={24} />
        </AvatarFallback>
      </Avatar>
      {isActive && (
        <span
          className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-green-500
                ring-2 ring-white md:h-3 md:w-3 animate-pulse"
        />
      )}
    </div>
  );
}
