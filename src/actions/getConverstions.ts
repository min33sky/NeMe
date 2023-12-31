import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import LoginRequiredException from '@/lib/exceptions/loginRequiredException';
import { getServerSession } from 'next-auth';

/**
 * Get all conversations of current user
 * @description 현재 사용자의 모든 대화를 가져옵니다
 */
export default async function getConversations() {
  const session = await getServerSession(authOptions);
  if (!session) throw new LoginRequiredException();

  try {
    return await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: session.user.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
  } catch (error: any) {
    console.log('***** getConversations error -> ', error);
    throw new Error(error.message);
  }
}
