import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to send a message' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { message, conversationId, image } = body;

    const newMessage = await prisma.message.create({
      include: {
        sender: true,
        seen: true,
      },
      data: {
        body: message,
        image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: session.user.id,
          },
        },
        seen: {
          connect: {
            id: session.user.id, //? conversationId 여야 하는거 아님????
          },
        },
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    // 채팅방 참여자들에게 새 메시지 알림
    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    // 채팅방 리스트에 새 메시지를 업데이트
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log('### error : ', error);
    return NextResponse.json(
      {
        error: 'Something went wrong while sending your message',
      },
      { status: 500 },
    );
  }
}
