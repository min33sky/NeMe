'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useConversation from '@/hooks/useConversation';
import { User } from '@prisma/client';
import type { FullConversationType } from '@/types/message';
import { User2, UserPlus } from 'lucide-react';
import ConversationBox from './ConversationBox';
import { cn } from '@/lib/utils';
import { useModal } from '@/hooks/useModal';
import GroupChatModal from './modals/GroupChatModal';
import { pusherClient } from '@/lib/pusher';
import { find } from 'lodash';

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

/**
 * 채팅방 목록
 */
export default function ConversationList({
  initialItems,
  title,
  users,
}: ConversationListProps) {
  const [items, setItems] = useState(initialItems);

  const router = useRouter();
  const session = useSession();

  const { conversationId, isOpen } = useConversation();

  const { onOpen } = useModal();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        }),
      );
    };

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });
    };

    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:remove', removeHandler);
  }, [pusherKey, router]);

  return (
    <>
      <GroupChatModal users={users} />

      <aside
        className={cn(
          `fixed bg-white dark:bg-slate-700 inset-y-0 overflow-y-auto border-r border-gray-200
                      dark:border-gray-800 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0`,
          isOpen ? 'hidden' : 'left-0 block w-full',
        )}
      >
        <div className="px-5">
          <div className="mb-4 flex items-center justify-between pt-4">
            <p className="text-2xl font-bold text-neutral-800 dark:text-slate-200">
              채팅방
            </p>

            <div
              onClick={() => onOpen('Group-Chat')}
              className="cursor-pointer rounded-full bg-gray-100 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800
                          p-2 text-gray-600 transition hover:opacity-75"
            >
              <UserPlus size={24} />
            </div>
          </div>

          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
