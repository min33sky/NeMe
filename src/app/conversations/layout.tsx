import getConversations from '@/actions/getConverstions';
import getUsers from '@/actions/getUser';
import ConversationList from '@/components/ConversationList';
import UserList from '@/components/UserList';
import Navbar from '@/components/navs/Navbar';

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
      <ConversationList
        users={users}
        title="Messages"
        initialItems={conversations}
      />
      {children}
    </>
  );
}
