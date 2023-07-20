import { User } from '@prisma/client';
import UserListItem from './UserListItem';

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <aside className="w-full overflow-y-auto h-full bg-white dark:bg-slate-700 pb-20 lg:pl-20 col-span-4">
      <div className="px-5">
        <div className="flex-col">
          <div className="py-4 text-2xl font-bold text-neutral-800 dark:text-slate-200">
            회원 목록
          </div>
        </div>

        {users.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </div>
    </aside>
  );
}
