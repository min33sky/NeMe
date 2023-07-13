import Link from 'next/link';

interface MobileNavItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

export default function MobileNavItem({
  href,
  icon: Icon,
  active,
  onClick,
}: MobileNavItemProps) {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      onClick={handleClick}
      href={href}
      className={`group flex w-full justify-center gap-x-3 p-4
        text-sm font-semibold leading-6 text-gray-500 hover:bg-gray-100
        hover:text-black ${active ? 'bg-gray-100 text-black' : ''}`}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
}
