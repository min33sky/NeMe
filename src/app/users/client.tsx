'use client';

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function UsersClient() {
  const { data: session } = useSession();

  return (
    <div>
      UsersClient - {JSON.stringify(session)}
      <Button onClick={() => signOut()}>로그아웃</Button>
    </div>
  );
}
