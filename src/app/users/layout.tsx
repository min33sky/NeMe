import getUsers from '@/actions/getUser';
import UserList from '@/components/UserList';
import Navbar from '@/components/navs/Navbar';

export const revalidate = 0;

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        <UserList users={users} />
        {children}
      </div>
    </>
  );
}
