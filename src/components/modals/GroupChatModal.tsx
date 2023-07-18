'use client';

import React from 'react';
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

interface GroupChatModalProps {
  users: User[];
}

const GroupChatValidator = z.object({
  name: z.string().min(1).max(20),
  members: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .refine((value) => value.length > 0, { message: '멤버를 선택해주세요.' }),
});

type FormType = z.infer<typeof GroupChatValidator>;

export default function GroupChatModal({ users }: GroupChatModalProps) {
  const { isOpen, onClose, onOpen } = useModal();

  const form = useForm<FormType>({
    resolver: zodResolver(GroupChatValidator),
    defaultValues: {
      name: '',
      members: [],
    },
  });

  const members = form.watch('members');

  const onSubmit = (formData: FormType) => {
    console.log('폼 데이터: ', formData);
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
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Members</FormLabel>
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

          <Button disabled={false} className="ml-auto" type="submit">
            취소
          </Button>

          <Button disabled={false} className="ml-auto" type="submit">
            만들기
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
