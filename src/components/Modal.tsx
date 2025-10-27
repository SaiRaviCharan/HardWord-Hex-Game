'use client';

import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
  actions?: ReactNode;
}

export default function Modal({ open, title, children, onClose, actions }: Readonly<ModalProps>) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center hw-modal-overlay">
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0" />

      <div className="relative mx-4 max-w-lg w-full hw-modal rounded-lg p-4 md:p-6 z-50">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>
        <div className="text-gray-300">{children}</div>

        {actions && <div className="mt-6 flex gap-3">{actions}</div>}
      </div>
    </div>
  );
}
