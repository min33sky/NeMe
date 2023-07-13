import Navbar from '@/components/navs/Navbar';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
