import getConversationById from '@/actions/getConversationById';
import getMessages from '@/actions/getMessages';
import EmptyState from '@/components/EmptyState';
import Body from '@/components/conversations/Body';
import Form from '@/components/conversations/Form';
import Header from '@/components/conversations/Header';
import React from 'react';

interface ConversationDetailPageProps {
  params: {
    conversationId: string;
  };
}

export default async function ConversationDetailPage({
  params: { conversationId },
}: ConversationDetailPageProps) {
  const conversation = await getConversationById(conversationId);
  const messages = await getMessages(conversationId);

  if (!conversation) {
    return (
      <div className={`h-full lg:pl-80`}>
        <div className={`flex h-full flex-col`}>
          <EmptyState />
        </div>
      </div>
    );
  }

  // TODO: paddingLeft 대신에 Layout을 Grid로 바꾸는게 어떨까?

  return (
    <div className={`h-full lg:pl-[400px]`}>
      <div className={`flex h-full flex-col`}>
        <Header conversation={conversation} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
}
