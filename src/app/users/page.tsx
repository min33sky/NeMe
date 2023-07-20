import React from 'react';
import EmptyState from '@/components/EmptyState';

export default async function UsersPage() {
  return (
    <div className="hidden h-full bg-blue-500 lg:block col-span-8">
      <EmptyState />
    </div>
  );
}
