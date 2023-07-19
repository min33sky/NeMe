'use client';

import { FullMessageType } from '@/types/message';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useConversation from '@/hooks/useConversation';
import MessageBox from './MessageBox';
import { pusherClient } from '@/lib/pusher';
import { find } from 'lodash';

interface ChatRoomBodyProps {
  initialMessages: FullMessageType[];
}

export default function ChatRoomBody({ initialMessages }: ChatRoomBodyProps) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  /**
   * 채팅방에 들어오면 최신 메세지를 읽음 처리
   */
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    // 새 메세지가 들어오면 스크롤바를 아래로 내림
    bottomRef?.current?.scrollIntoView();

    const newMessageHandler = (newMessage: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((prevMessages) => {
        // ? 새로운 메세지가 이미 존재하는 경우 무시
        if (find(prevMessages, { id: newMessage.id })) {
          return prevMessages;
        }

        // 새로운 메세지를 기존 메세지 리스트에 추가
        return [...prevMessages, newMessage];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        }),
      );
    };

    pusherClient.bind('messages:new', newMessageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', newMessageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <section className="flex-1 overflow-y-auto dark:bg-slate-700">
      {messages.map((message, idx) => (
        <MessageBox
          key={message.id}
          isLast={idx === messages.length - 1}
          data={message}
        />
      ))}

      {/* 스크롤바 위치 조절용 */}
      <div className="pt-24" ref={bottomRef} />
    </section>
  );
}
