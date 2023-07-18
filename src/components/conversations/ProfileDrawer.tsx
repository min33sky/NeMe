'use client';

import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';

import React, { startTransition, useCallback, useMemo, useState } from 'react';
import { Conversation, User } from '@prisma/client';
import useOtherUser from '@/hooks/useOtherUser';
import { format } from 'date-fns';
import UserAvatar from '../UserAvatar';
import useAlert from '@/hooks/useAlert';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';
import AvatarGroup from '../AvatarGroup';

interface ProfileDrawerProps {
  data: Conversation & {
    users: User[];
  };
}

export default function ProfileDrawer({ data }: ProfileDrawerProps) {
  const { onOpen, onClose } = useAlert();

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

  const handleClick = () => {
    onOpen({
      dialogTitle: 'Delete Conversation',
      dialogDescription: 'Are you sure you want to delete this conversation?',
      onConfirm: onDelete,
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axios.delete(`/api/conversations/${data.id}`);

      toast.loading('삭제 중...');

      startTransition(() => {
        onClose();
        router.refresh();
        router.push('/conversations');
        toast.success('삭제 성공');
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      toast.error('삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [data.id, onClose, router]);

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
            <div className="flex flex-col items-center">
              <div className="mb-2">
                {data.isGroup ? (
                  <AvatarGroup users={data.users} />
                ) : (
                  <>
                    <UserAvatar avatarUrl={otherUser.image} />
                  </>
                )}
              </div>

              <div>{title}</div>

              <div className="text-sm text-gray-500">{statusText}</div>

              <Button
                onClick={handleClick}
                variant={'default'}
                className="p-4 mt-6 rounded-lg"
              >
                <Trash2 onClick={handleClick} className="w-4 h-4 mr-2" />
                <p>Delete</p>
              </Button>
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
