import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import LoginRequiredException from '@/lib/exceptions/loginRequiredException';

/**
 * Get all users except the current user
 */
export default async function getUsers() {
  const session = await getServerSession(authOptions);
  if (!session) throw new LoginRequiredException();

  try {
    return await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });
  } catch (error: any) {
    console.log('***** getUsers error -> ', error);
    throw new Error(error.message);
  }
}
