'use client';

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

export default function MessageInput({
  placeholder,
  id,
  type,
  required,
  register,
  errors,
}: MessageInputProps) {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="w-full rounded-full bg-neutral-100 dark:bg-slate-700 dark:text-slate-200 px-4 py-2 font-light text-black focus:outline-none"
      />
    </div>
  );
}
