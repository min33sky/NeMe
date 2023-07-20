import getConversationById from '@/actions/getConversationById';
import getMessages from '@/actions/getMessages';
import EmptyState from '@/components/EmptyState';
import ChatRoomHeader from '@/components/conversations/ChatRoomHeader';
import ChatInput from '@/components/conversations/ChatInput';
import ChatRoomBody from '@/components/conversations/ChatRoomBody';

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

  return (
    <div className={`h-full w-full col-span-8`}>
      <div className={`flex h-full flex-col`}>
        <ChatRoomHeader conversation={conversation} />
        <ChatRoomBody initialMessages={messages} />
        <ChatInput />
      </div>
    </div>
  );
}
