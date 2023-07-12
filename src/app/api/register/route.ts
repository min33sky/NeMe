import { RegisterValidator } from '@/lib/validators/auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, name, password } = RegisterValidator.parse(body);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    console.log('### error', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            message: '이미 사용중인 이메일입니다.',
          },
          {
            status: 400,
          },
        );
      }
    }

    return NextResponse.json(
      {
        message: '회원가입 도중 알 수 없는 에러가 발생했습니다.',
      },
      {
        status: 500,
      },
    );
  }
}
