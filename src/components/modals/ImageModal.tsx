import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import Image from 'next/image';

interface ImageModalProps {
  isOpen?: boolean;
  onClose: () => void;
  src?: string | null;
}

export default function ImageModal({ isOpen, onClose, src }: ImageModalProps) {
  if (!src) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <div className="w-80 h-80">
          <Image className="object-cover" fill alt="Image" src={src} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
