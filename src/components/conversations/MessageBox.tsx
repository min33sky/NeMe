'use client';

import { FullMessageType } from '@/types/message';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import UserAvatar from '../UserAvatar';
import { cn } from '@/lib/utils';
import ImageModal from '../modals/ImageModal';

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

export default function MessageBox({ data, isLast }: MessageBoxProps) {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = useMemo(
    () =>
      (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name)
        .join(', '),
    [data.seen, data?.sender?.email],
  );

  //****************************************** 확인용 로그
  // console.log('seenlist: ', seenList);
  // console.log('isOwn: ', isOwn);
  // console.log('isLast: ', isLast);
  // console.log('시발: ', isLast && isOwn && seenList.length > 0);

  return (
    <div className={cn('flex gap-3 p-4', isOwn && 'justify-end')}>
      <div className={cn(isOwn && 'order-2')}>
        <UserAvatar avatarUrl={data.sender.image} user={data.sender} />
      </div>

      <div className={cn('flex flex-col gap-2', isOwn && 'items-end')}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500 dark:text-slate-200">
            {data.sender.name}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>

        <div
          className={cn(
            'text-sm w-fit overflow-hidden',
            isOwn
              ? 'bg-sky-500 text-white dark:bg-slate-200 dark:text-slate-800'
              : 'bg-gray-100 dark:bg-slate-800 dark:text-slate-200',
            data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3',
          )}
        >
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />

          {data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              className="translate cursor-pointer object-cover transition hover:scale-110"
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>

        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500 dark:text-slate-300">
            {`${seenList}님이 확인`}
          </div>
        )}
      </div>
    </div>
  );
}
