'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useConversation from '@/hooks/useConversation';
import clsx from 'clsx';
import { User } from '@prisma/client';
import type { FullConversationType } from '@/types/message';
import { User2 } from 'lucide-react';
import ConversationBox from './ConversationBox';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const session = useSession();

  const { conversationId, isOpen } = useConversation();

  console.log(
    `%c conversationId : ${conversationId || 'None'} `,
    'color: #ff0000; font-size: 16px;',
  );

  // const pusherKey = useMemo(() => {
  //   return session.data?.user?.email;
  // }, [session.data?.user?.email]);
  //
  // useEffect(() => {
  //   if (!pusherKey) {
  //     return;
  //   }
  //
  //   // pusherClient.subscribe(pusherKey);
  //
  //   const updateHandler = (conversation: FullConversationType) => {
  //     setItems((current) =>
  //       current.map((currentConversation) => {
  //         if (currentConversation.id === conversation.id) {
  //           return {
  //             ...currentConversation,
  //             messages: conversation.messages,
  //           };
  //         }
  //
  //         return currentConversation;
  //       })
  //     );
  //   };
  //
  //   const newHandler = (conversation: FullConversationType) => {
  //     setItems((current) => {
  //       if (find(current, { id: conversation.id })) {
  //         return current;
  //       }
  //
  //       return [conversation, ...current];
  //     });
  //   };
  //
  //   const removeHandler = (conversation: FullConversationType) => {
  //     setItems((current) => {
  //       return [...current.filter((convo) => convo.id !== conversation.id)];
  //     });
  //   };
  //
  //   pusherClient.bind("conversation:update", updateHandler);
  //   pusherClient.bind("conversation:new", newHandler);
  //   pusherClient.bind("conversation:remove", removeHandler);
  // }, [pusherKey, router]);

  return (
    <>
      {/*<GroupChatModal*/}
      {/*  users={users}*/}
      {/*  isOpen={isModalOpen}*/}
      {/*  onClose={() => setIsModalOpen(false)}*/}
      {/*/>*/}
      <aside
        className={clsx(
          `fixed bg-white inset-y-0 overflow-y-auto border-r border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0`,
          isOpen ? 'hidden' : 'left-0 block w-full',
        )}
      >
        <div className="px-5">
          <div className="mb-4 flex justify-between pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition hover:opacity-75"
            >
              <User2 size={20} />
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
