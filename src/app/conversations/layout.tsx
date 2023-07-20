import getConversations from '@/actions/getConverstions';
import getUsers from '@/actions/getUser';
import ConversationList from '@/components/ConversationList';
import Navbar from '@/components/navs/Navbar';

export const revalidate = 0;

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  const conversations = await getConversations();

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        <ConversationList
          users={users}
          title="Messages"
          initialItems={conversations}
        />
        {children}
      </div>
    </>
  );
}
