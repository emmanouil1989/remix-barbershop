import React from "react";
import {
  Dialog as ReactAriaDialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";

type DialogTriggerProps = {
  triggerButton?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: () => void;
  role?: "dialog" | "alertdialog";
};
export default function Dialog({
  triggerButton,
  children,
  open,
  onOpenChange,
  role,
}: DialogTriggerProps) {
  return (
    <DialogTrigger>
      {triggerButton && triggerButton}
      <ModalOverlay
        isDismissable
        isOpen={open}
        onOpenChange={onOpenChange}
        className="
          fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur"
      >
        <Modal className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
          <ReactAriaDialog role={role} className="outline-none relative">
            {children}
          </ReactAriaDialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
