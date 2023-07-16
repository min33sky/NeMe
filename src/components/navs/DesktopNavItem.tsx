import useAlert from '@/hooks/useAlert';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DesktopNavItemProps {
  label: string;
  icon: any;
  href: string;
  handler?: () => void;
  active?: boolean;
}

export default function DesktopNavItem({
  label,
  icon: Icon,
  href,
  handler,
  active,
}: DesktopNavItemProps) {
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
    <li onClick={handleClick} key={label}>
      <Link
        href={href}
        className={cn(
          'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-500  hover:bg-gray-100 hover:text-black ',
          active ? 'bg-slate-200 text-black' : '',
        )}
      >
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
}
