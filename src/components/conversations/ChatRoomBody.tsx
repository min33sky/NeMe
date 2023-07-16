'use client';

import { FullMessageType } from '@/types/message';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useConversation from '@/hooks/useConversation';
import MessageBox from './MessageBox';

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

  // useEffect(() => {
  //   pusherClient.subscribe(conversationId)
  //   bottomRef?.current?.scrollIntoView();
  //
  //   const messageHandler = (message: FullMessageType) => {
  //     axios.post(`/api/conversations/${conversationId}/seen`);
  //
  //     setMessages((current) => {
  //       if (find(current, { id: message.id })) {
  //         return current;
  //       }
  //
  //       return [...current, message]
  //     });
  //
  //     bottomRef?.current?.scrollIntoView();
  //   };
  //
  //   const updateMessageHandler = (newMessage: FullMessageType) => {
  //     setMessages((current) => current.map((currentMessage) => {
  //       if (currentMessage.id === newMessage.id) {
  //         return newMessage;
  //       }
  //
  //       return currentMessage;
  //     }))
  //   };
  //
  //
  //   pusherClient.bind('messages:new', messageHandler)
  //   pusherClient.bind('message:update', updateMessageHandler);
  //
  //   return () => {
  //     pusherClient.unsubscribe(conversationId)
  //     pusherClient.unbind('messages:new', messageHandler)
  //     pusherClient.unbind('message:update', updateMessageHandler)
  //   }
  // }, [conversationId]);

  return (
    <section className="flex-1 overflow-y-auto">
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
