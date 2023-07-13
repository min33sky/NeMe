'use client';

import EmptyState from '@/components/EmptyState';
import useConversation from '@/hooks/useConversation';
import { cn } from '@/lib/utils';
import React from 'react';

export default function Conversations() {
  const { isOpen } = useConversation();

  console.log(`%c isOpen: ${isOpen}`, 'color: #ff0000');

  return (
    <div
      className={cn('h-full lg:block lg:pl-80', isOpen ? 'block' : 'hidden')}
    >
      <EmptyState />
    </div>
  );
}
