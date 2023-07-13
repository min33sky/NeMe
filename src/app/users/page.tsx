import React from 'react';
import UsersClient from './client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import EmptyState from '@/components/EmptyState';

export default async function UsersPage() {
  // ? 미들웨어로 처리함
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   return redirect('/');
  // }

  return (
    <div className="hidden h-full bg-blue-500 lg:block lg:pl-80">
      {/* <UsersClient /> */}
      <EmptyState />
    </div>
  );
}
