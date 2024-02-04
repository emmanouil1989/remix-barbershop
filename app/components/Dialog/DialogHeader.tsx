import * as RadixDialog from "@radix-ui/react-dialog";
import React from "react";

type DialogHeaderProps = {
  title: string;
  description?: string;
};
export default function DialogHeader({
  title,
  description,
}: DialogHeaderProps) {
  return (
    <>
      <RadixDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
        {title}
      </RadixDialog.Title>
      {description && (
        <RadixDialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
          {description}
        </RadixDialog.Description>
      )}
    </>
  );
}
