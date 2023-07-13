import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserIcon } from 'lucide-react';

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
}

export default function UserAvatar({ avatarUrl }: UserAvatarProps) {
  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src={avatarUrl || undefined} alt="@shadcn" />
        <AvatarFallback>
          <UserIcon size={24} />
        </AvatarFallback>
      </Avatar>
      <span
        className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-green-500
            ring-2 ring-white md:h-3 md:w-3 animate-pulse"
      />
    </div>
  );
}
