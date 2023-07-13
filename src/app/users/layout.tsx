import getUsers from '@/actions/getUser';
import UserList from '@/components/UserList';
import Navbar from '@/components/navs/Navbar';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <>
      <Navbar />
      <UserList users={users} />
      {children}
    </>
  );
}
