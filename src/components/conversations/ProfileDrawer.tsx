'use client';

import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import React, { useMemo } from 'react';
import { Conversation, User } from '@prisma/client';
import useOtherUser from '@/hooks/useOtherUser';
import { format } from 'date-fns';
import UserAvatar from '../UserAvatar';

interface ProfileDrawerProps {
  data: Conversation & {
    users: User[];
  };
}

export default function ProfileDrawer({ data }: ProfileDrawerProps) {
  const otherUser = useOtherUser(data);

  const joinedDate = useMemo(
    () => format(new Date(otherUser.createdAt), 'PP'),
    [otherUser.createdAt],
  );

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }
    return 'Active';
  }, [data]);

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <MoreHorizontal
            size={24}
            className="cursor-pointer text-slate-500 transition hover:text-sky-600"
          />
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            {/* <SheetTitle>Are you sure absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription> */}
            <div className="flex flex-col items-center">
              <div className="mb-2">
                {data.isGroup ? (
                  <>아바타 그룹이 들어올 자리</>
                ) : (
                  <>
                    <UserAvatar avatarUrl={otherUser.image} />
                  </>
                )}
              </div>
              <div>{title}</div>
              <div className="text-sm text-gray-500">{statusText}</div>
              <div className="flex gap-10 my-8">
                <div className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <Trash2 size={24} />
                  </div>
                  <div className="text-sm font-light text-neutral-600"></div>{' '}
                  Delete
                </div>
              </div>
            </div>
          </SheetHeader>
          <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
            <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
              {data.isGroup && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                    Emails
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {data.users.map((user) => user.email).join(', ')}
                  </dd>
                </div>
              )}
              {!data.isGroup && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {otherUser.email}
                  </dd>
                </div>
              )}

              {!data.isGroup && (
                <>
                  <hr />
                  <div>
                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                      Joined
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      <time dateTime={joinedDate}>{joinedDate}</time>
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
