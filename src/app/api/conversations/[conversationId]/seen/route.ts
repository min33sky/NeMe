import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

interface SeenProps {
  params: {
    conversationId?: string;
  };
}

/**
 ** 가장 최신 메세지 확인 처리 API
 */
export async function POST(request: Request, { params }: SeenProps) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          message: '로그인이 필요합니다.',
        },
        {
          status: 401,
        },
      );
    }

    const { conversationId } = params;

    //? 채팅방 정보 가져오기
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
      return NextResponse.json(
        { message: '채팅방이 존재하지 않습니다.' },
        { status: 404 },
      );
    }

    // 채팅방의 마지막 메세지 가져오기
    const lastMessage = conversation.messages.at(-1);

    // 비어있는 채팅방이라면 그냥 리턴
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    //* 채팅방의 마지막 메세지를 확인했다고 표시
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
            id: session.user.id, //? 현재 로그인한 유저가 확인했다고 표시
          },
        },
      },
    });

    // Update all connections with new seen
    await pusherServer.trigger(session.user.email!, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    });

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds.indexOf(session.user.id) !== -1) {
      return NextResponse.json(conversation);
    }

    // Update last message seen
    await pusherServer.trigger(
      conversationId!,
      'message:update',
      updatedMessage,
    );

    return NextResponse.json({
      message: '최신 메세지 확인 처리 완료.',
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: '최신 메세지 확인 처리 중 서버 에러 발생' },
      { status: 500 },
    );
  }
}
