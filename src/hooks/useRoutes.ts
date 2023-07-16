import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import useConversation from './useConversation';
import { LogOut, MessageCircle, Users } from 'lucide-react';

/**
 * Returns the routes for the sidebar and footer.
 */
export default function useRoutes() {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        href: '/conversations',
        icon: MessageCircle,
        active: pathname === '/conversations' || !!conversationId,
      },
      {
        label: 'Users',
        href: '/users',
        icon: Users,
        active: pathname === '/users',
      },
      {
        label: 'Logout',
        href: '#',
        icon: LogOut,
        handler: () => signOut(),
      },
    ],
    [pathname, conversationId],
  );

  return routes;
}
