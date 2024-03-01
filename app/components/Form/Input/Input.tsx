import React from "react";
import { useField } from "remix-validated-form";
import type { ForwardedRef } from "react";
import type { InputProps } from "react-aria-components";
import {
  InputContext,
  Label,
  Input as ReactAriaInput,
  useContextProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

type Props = InputProps & {
  label?: string;
};

export default function Input(
  props: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  [props, ref] = useContextProps(props, ref, InputContext);
  const { label, className, name, form, ...rest } = props;
  const { error, getInputProps } = useField(props?.name || "input", {
    formId: form,
  });

  const mergedClasses = twMerge(`w-full ${className}`);
  const inputProps = getInputProps({ ...rest });

  return (
    <>
      {label && <Label htmlFor={name}>{label}</Label>}
      <ReactAriaInput {...inputProps} className={mergedClasses} />
      {error && <span className="text-red-600 text-base">{error}</span>}
    </>
  );
}
