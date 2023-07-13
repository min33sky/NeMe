import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
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

    const body = await req.json();
    const { userId, isGroup, members, name } = body;

    if (isGroup && (!members || members.length < 2 || !name)) {
      return NextResponse.json(
        {
          message:
            '그룹 채팅을 생성하기 위해서는 최소 2명의 사용자가 필요합니다.',
        },
        {
          status: 400,
        },
      );
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            //? 기존 멤버 + 새로운 멤버 (현재 로그인 한 유저)를 그룹에 추가
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: session.user.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      return NextResponse.json(newConversation);
    }

    //? 기존 존재하는 채팅방인지 확인 (1:1 대화)
    const existingConversatios = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            userIds: {
              equals: [session.user.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, session.user.id],
            },
          },
        ],
      },
    });

    if (existingConversatios) {
      return NextResponse.json(existingConversatios);
    }

    //? 기존 존재하는 채팅방이 아니라면 새로운 채팅방 생성
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: session.user.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
