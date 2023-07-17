'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ModalType, useModal } from '@/hooks/useModal';
import { Button } from '../ui/button';

interface ModalProps {
  type: ModalType;
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({
  type,
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  const { modalType } = useModal();

  if (modalType !== type) {
    return null;
  }

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <>{children}</>

        {/* <DialogFooter className="pt-6">
          <Button
            type="button"
            // disabled={isLoading}
            variant={'outline'}
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            type="submit"
            // disabled={isLoading}
            className="w-full sm:w-auto"
            // isLoading={isLoading}
          >
            계속
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
