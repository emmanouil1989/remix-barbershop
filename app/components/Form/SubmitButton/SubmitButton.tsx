import React from "react";
import { useFormContext, useIsSubmitting } from "remix-validated-form";
import Button from "~/components/button/Button";
import type { ButtonHTMLAttributes } from "react";
import type { ButtonProps as ReactAriaButtonProps } from "react-aria-components";

type SubmitButtonProps = {
  submitText: string;
  submittingText: string;
};

type Props = SubmitButtonProps &
  ReactAriaButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export const SubmitButton = ({
  submittingText,
  submitText,
  form,
  ...props
}: Props) => {
  const isSubmitting = useIsSubmitting(form);
  const { isValid } = useFormContext();
  const disabled = isSubmitting || !isValid;
  return (
    <Button {...props} type="submit" isDisabled={disabled}>
      {isSubmitting ? submittingText : submitText}
    </Button>
  );
};
