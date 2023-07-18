'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { FullConversationType } from '@/types/message';
import useOtherUser from '@/hooks/useOtherUser';
import UserAvatar from './UserAvatar';
import AvatarGroup from './AvatarGroup';

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

/**
 * 채팅방 박스 컴포넌트
 * @param data 채팅 내용
 * @param selected 현재 활성화된 채팅방인지 유무
 */
export default function ConversationBox({
  data,
  selected,
}: ConversationBoxProps) {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email],
  );

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  /**
   * 가장 최신 메세지 표시하기
   */
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return '이미지를 전송했습니다.';
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return '대화를 시작하세요.';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `relative flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 transition hover:bg-neutral-100`,
        selected ? 'bg-neutral-100' : 'bg-white',
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <UserAvatar avatarUrl={otherUser.image} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="mb-1 flex items-center justify-between">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs font-light text-gray-400">
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `truncate text-sm`,
              hasSeen ? 'text-gray-500' : 'font-medium text-black',
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
}
