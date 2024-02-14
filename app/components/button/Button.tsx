import React from "react";
import { twMerge } from "tailwind-merge";
import type { ButtonProps as ReactAriaButtonProps } from "react-aria-components";
import { Button as ReactAriaButton } from "react-aria-components";

export type ButtonProps = ReactAriaButtonProps &
  React.RefAttributes<HTMLButtonElement>;
export default function Button({
  onPress,
  children,
  className,
  ...props
}: ButtonProps) {
  const mergedClasses = twMerge(
    `bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded outline-none ${className}`,
  );
  return (
    <ReactAriaButton {...props} onPress={onPress} className={mergedClasses}>
      {children}
    </ReactAriaButton>
  );
}
