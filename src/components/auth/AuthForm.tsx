'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  LoginRequest,
  LoginValidator,
  RegisterRequest,
  RegisterValidator,
} from '@/lib/validators/auth';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';

type Variant = 'Login' | 'Register';

export default function AuthForm() {
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('Login');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterRequest | LoginRequest>({
    resolver: zodResolver(
      variant === 'Login' ? LoginValidator : RegisterValidator,
    ),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const toggleVariant = useCallback(() => {
    setVariant((prev) => (prev === 'Login' ? 'Register' : 'Login'));
  }, []);

  const onSubmit = (data: RegisterRequest | LoginRequest) => {
    console.log('data: ', data);
  };

  return (
    <section className="mt-8 mx-2 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow-lg sm:rounded-lg sm:px-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>패스워드</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="6자 ~ 16자"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {variant === 'Register' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="사용자1" {...field} />
                    </FormControl>
                    <FormDescription>
                      서비스에서 사용할 닉네임을 적어주세요.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700"
            >
              {variant === 'Register' ? '회원가입' : '로그인'}
            </Button>
          </form>
        </Form>

        <footer className="mt-6 flex items-center justify-center gap-1 px-2 text-sm text-gray-500">
          <p>
            {variant === 'Register'
              ? '이미 계정이 있으신가요?'
              : '계정이 없으신가요?'}
          </p>
          <Button
            onClick={toggleVariant}
            variant={'link'}
            className="text-sky-500"
            size={'sm'}
          >
            {variant === 'Register' ? '로그인' : '회원가입'}
          </Button>
        </footer>
      </div>
    </section>
  );
}
