import useAlert from '@/hooks/useAlert';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface MobileNavItemProps {
  href: string;
  icon: any;
  active?: boolean;
  handler?: () => void;
}

export default function MobileNavItem({
  href,
  icon: Icon,
  active,
  handler,
}: MobileNavItemProps) {
  const { onOpen } = useAlert();

  const handleClick = () => {
    if (handler) {
      onOpen({
        dialogTitle: '로그아웃',
        dialogDescription: '로그아웃 하시겠습니까?',
        onConfirm: handler,
      });
    }
  };

  return (
    <Link
      onClick={handleClick}
      href={href}
      className={cn(
        `group flex w-full justify-center gap-x-3 p-4
      text-sm font-semibold leading-6 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900 dark:hover:text-slate-200
      hover:text-black`,
        active
          ? 'bg-gray-100 text-black dark:bg-slate-900 dark:text-slate-200'
          : '',
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
}
