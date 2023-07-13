import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

/**
 * Get all users except the current user
 */
export default async function getUsers() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return [];
    }

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
  } catch (error) {
    console.log('***** getUsers error', error);

    return [];
  }
}
