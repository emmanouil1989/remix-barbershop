import React from "react";
import { useField } from "remix-validated-form";
import type { InputHTMLAttributes } from "react";
import {
  TextField,
  Label,
  Input as ReactAriaInput,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

type MyInputProps = {
  label?: string;
  name?: string;
};

type Props = MyInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, "name">;

const Input = ({ name, label, type, className, ...rest }: Props) => {
  const { error, getInputProps } = useField(name || "input");
  const mergedClasses = twMerge(`w-full ${className}`);
  const { defaultValue, ...restInputProps } = getInputProps({
    id: name,
    type,
    ...rest,
  });
  return (
    <TextField defaultValue={defaultValue} className={className}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <ReactAriaInput {...restInputProps} className={mergedClasses} />
      {error && <span className="text-red-600 text-base">{error}</span>}
    </TextField>
  );
};
export default Input;
