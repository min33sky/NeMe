import EmptyState from '@/components/EmptyState';
import { cn } from '@/lib/utils';
import React from 'react';

export default function Conversations() {
  return (
    <div className={cn('h-full w-full col-span-8')}>
      <EmptyState />
    </div>
  );
}
