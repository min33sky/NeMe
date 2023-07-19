import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      conversationId: string;
    };
  },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          message: 'You are not logged in',
        },
        {
          status: 401,
        },
      );
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: params.conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return NextResponse.json(
        {
          message: 'Conversation not found',
        },
        {
          status: 404,
        },
      );
    }

    const deleteConversation = await prisma.conversation.deleteMany({
      where: {
        id: params.conversationId,
        userIds: {
          hasSome: [session.user.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          'conversation:remove',
          existingConversation,
        );
      }
    });

    return NextResponse.json(deleteConversation);
  } catch (error) {
    console.log('***** Error - delete conversation :', error);
    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      },
    );
  }
}
