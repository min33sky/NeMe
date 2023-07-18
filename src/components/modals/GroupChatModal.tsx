'use client';

import React, { startTransition, useState } from 'react';
import Modal from './Modal';
import { useModal } from '@/hooks/useModal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Select from '../Select';
import { User } from '@prisma/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogFooter } from '../ui/dialog';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

interface GroupChatModalProps {
  users: User[];
}

const GroupChatValidator = z.object({
  name: z
    .string()
    .min(1, {
      message: '1글자 이상 입력해주세요.',
    })
    .max(16, '16글자 이하로 입력해주세요.'),
  members: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .refine((value) => value.length > 0, { message: '멤버를 선택해주세요.' }),
});

type FormType = z.infer<typeof GroupChatValidator>;

export default function GroupChatModal({ users }: GroupChatModalProps) {
  const { isOpen, onClose, onOpen } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(GroupChatValidator),
    defaultValues: {
      name: '',
      members: [],
    },
  });

  const members = form.watch('members');

  const onSubmit = async (formData: FormType) => {
    console.log('폼 데이터: ', formData);

    try {
      setIsLoading(true);

      const response = await axios.post('/api/conversations', {
        ...formData,
        isGroup: true,
      });

      startTransition(() => {
        toast.success('그룹 채팅방이 생성되었습니다.');
        router.refresh();
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

  console.log('멤버들: ', members);

  return (
    <Modal
      type="Group-Chat"
      onClose={onClose}
      isOpen={isOpen}
      title="그룹 채팅방 만들기"
      description="채팅방 이름을 입력해주세요."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>채팅방 이름</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="members"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사용자 목록</FormLabel>
                <FormControl>
                  <Select
                    disabled={false}
                    options={users.map((user) => ({
                      value: user.id,
                      label: user.name,
                    }))}
                    onChange={(value) =>
                      form.setValue('members', value as any, {
                        shouldValidate: true,
                      })
                    }
                    value={members}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="gap-4">
            <Button
              disabled={false}
              variant={'secondary'}
              className="w-full"
              type="button"
            >
              취소
            </Button>

            <Button disabled={false} className="w-full" type="submit">
              만들기
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
}
