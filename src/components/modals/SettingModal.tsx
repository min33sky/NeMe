'use client';

import React, { startTransition, useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { useSession } from 'next-auth/react';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import Image from 'next/image';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const SettingValidator = z.object({
  name: z.string().min(2).max(20),
  image: z.string().url().optional(),
});

export default function SettingModal() {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const { isOpen, onClose } = useModal();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  type FormType = z.infer<typeof SettingValidator>;

  const form = useForm<FormType>({
    resolver: zodResolver(SettingValidator),
  });

  // console.log('설정 모달: ', session?.user);

  // console.log(form.watch('image'));
  // console.log(form.watch('name'));

  const onSubmit = async (data: FormType) => {
    console.log('업데이트 값 : ', data);
    try {
      setIsLoading(true);

      const response = await axios.patch('/api/settings', data);

      startTransition(() => {
        router.refresh();
        toast.success('프로필이 변경되었습니다.');
        onClose();
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      toast.error('알 수 없는 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    // console.log('이미지 업로드');
    // console.log(e.target.files);

    if (!e.target.files) return;

    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    );
    formData.append('timestamp', String(Date.now() / 1000));
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

    await axios
      .post(process.env.NEXT_PUBLIC_CLOUDINARY_API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log('이미지 업로드 성공 : ', res.data);
        console.log('유 알 엘 : ', res.data.secure_url);
        form.setValue('image', res.data.secure_url);
      });
  };

  useEffect(() => {
    if (session?.user) {
      form.setValue('name', session?.user.name || 'no name', {
        shouldValidate: true,
      });

      form.setValue('image', session?.user.image || 'no image', {
        shouldValidate: true,
      });
    }
  }, [form, session?.user]);

  // console.log('이미지 : ', form.watch('image'));
  // console.log('이름 : ', form.watch('name'));

  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <Modal
      type="setting"
      title="프로필 설정"
      description="프로필 설정을 통해 프로필을 변경할 수 있습니다."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="mt-2 flex items-center gap-x-3">
                      <Image
                        width="48"
                        height="48"
                        className="rounded-full"
                        src={form.watch('image') || ''}
                        alt="Avatar"
                      />

                      <Input
                        {...field}
                        ref={(input) => {
                          fileRef.current = input;
                        }}
                        onChange={handleUpload}
                        className="hidden"
                        value={''}
                        type="file"
                      />

                      <Button
                        type="button"
                        onClick={() => {
                          fileRef.current?.click();
                        }}
                      >
                        이미지 업로드
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:grid md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={false} className="ml-auto" type="submit">
              저장
            </Button>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
