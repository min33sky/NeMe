import { User } from 'next-auth';

export type UserWithId =
  | (User & {
      id: string;
    })
  | undefined;
