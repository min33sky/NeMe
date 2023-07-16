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
import { Icons } from '../Icons';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

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

  const onSubmit = useCallback(
    async (data: RegisterRequest | LoginRequest) => {
      try {
        setIsLoading(true);

        if (variant === 'Register') {
          await axios.post('/api/register', data);

          toast.success('회원가입이 완료되었습니다.');

          // 로그인 요청
          const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
          });

          if (res?.error) {
            toast.error('로그인에 실패했습니다.');
          } else if (res?.ok) {
            router.push('/conversations');
          }
        } else {
          // 로그인 요청
          const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
          });

          console.log('res: ', res);

          if (res?.error) {
            toast.error('로그인에 실패했습니다.');
          } else if (res?.ok) {
            router.push('/conversations');
          }
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          return toast.error(error.response?.data.message);
        }

        console.log('Login Error : ', error);

        toast.error('알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [router, variant],
  );

  const socialAction = useCallback(async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      await signIn(provider, {
        callbackUrl: '/conversations',
      });
    } catch (error) {
      console.log('소셜 로그인 에러: ', error);
      toast.error('로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <section className="mt-4 mx-2 sm:mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 sm:px-10 py-6 sm:py-8 shadow-lg sm:rounded-lg ">
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
                      autoFocus
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

        {/* 소셜 로그인 버튼 */}
        <div className={`relative mt-6`}>
          <div className={`absolute inset-0 flex items-center`}>
            <div className={`w-full border-t border-gray-300`}></div>
          </div>
          <div className={`relative flex justify-center text-sm`}>
            <span className={`bg-white px-2 text-gray-500`}>
              다른 방법으로 로그인하기
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            onClick={() => socialAction('google')}
            variant={'outline'}
            className="flex items-center text-base"
          >
            <Icons.google className="w-5 h-5 mr-1" />
            구글로 로그인
          </Button>
          <Button
            type="button"
            onClick={() => socialAction('github')}
            variant={'outline'}
            className="flex items-center text-base"
          >
            <Icons.github className="w-5 h-5 mr-1" />
            깃허브로 로그인
          </Button>
        </div>

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
