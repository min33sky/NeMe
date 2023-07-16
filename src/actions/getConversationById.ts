import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import LoginRequiredException from '@/lib/exceptions/loginRequiredException';
import { getServerSession } from 'next-auth';

/**
 * Get a conversation by id
 * @description 채팅방 id로 채팅방 정보를 가져옵니다
 * @param conversationId id of the conversation
 */
export default async function getConversationById(conversationId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new LoginRequiredException();

  try {
    return await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
  } catch (error: any) {
    console.error('[Error in getConversationById] - ', error);
    throw new Error(error.message);
  }
}
