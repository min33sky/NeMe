import { prisma } from '@/lib/db';

/**
 * Get all messages of a conversation
 * @description 채팅방의 모든 메시지를 가져옵니다
 * @param conversationId id of the conversation
 */
export default async function getMessages(conversationId: string) {
  try {
    return await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  } catch (error: any) {
    console.error('Error in getMessages', error);
    return [];
  }
}
