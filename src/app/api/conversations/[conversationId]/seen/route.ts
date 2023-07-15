import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

interface SeenProps {
  params: {
    conversationId?: string;
  };
}

export async function POST(request: Request, { params }: SeenProps) {
  /**
   ** 메세지를 확인했다고 표시하는 API
   */
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to send a message' },
        { status: 401 },
      );
    }

    const { conversationId } = params;

    //? 존재하는 채팅방 찾기
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    //? 채팅방의 마지막 메세지 가져오기
    // const lastMessage = conversation.messages[conversation.messages.length - 1];
    const lastMessage = conversation.messages.at(-1);

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    //? 채팅방의 마지막 메세지를 확인했다고 표시
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    // Update all connections with new seen
    // await pusherServer.trigger(currentUser.email, 'conversation:update', {
    //   id: conversationId,
    //   messages: [updatedMessage]
    // });
    //
    // // If user has already seen the message, no need to go further
    // if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
    //   return NextResponse.json(conversation);
    // }
    //
    // // Update last message seen
    // await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

    return NextResponse.json('Success');
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
