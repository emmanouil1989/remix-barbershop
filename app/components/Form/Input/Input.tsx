import React from "react";
import { useField } from "remix-validated-form";
import type { InputHTMLAttributes } from "react";

type MyInputProps = {
  label: string;
  name: string;
};

type Props = MyInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, "name">;

export const Input = ({ name, label, type, className, ...rest }: Props) => {
  const { error, getInputProps } = useField(name);
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        {...getInputProps({ id: name, type, ...rest })}
        className={className}
      />
      {error && <span className="text-red-600 text-base">{error}</span>}
    </>
  );
};
