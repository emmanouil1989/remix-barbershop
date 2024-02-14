import React from "react";
import { Heading } from "react-aria-components";

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
      <Heading className=" m-0  font-medium">{title}</Heading>
      {description && (
        <p className=" mt-[10px] mb-5 text-[15px] leading-normal">
          {description}
        </p>
      )}
    </>
  );
}
