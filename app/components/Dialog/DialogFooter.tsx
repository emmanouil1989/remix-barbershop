import React from "react";

type DialogFooterProps = {
  children: React.ReactNode;
};
export default function DialogFooter({ children }: DialogFooterProps) {
  return <div className="flex justify-end gap-4 mt-4">{children}</div>;
}
