import React from "react";

import type {
  TimeFieldProps,
  TimeValue,
  ValidationResult,
} from "react-aria-components";
import {
  DateInput,
  DateSegment,
  FieldError,
  Label,
  Text,
  TimeField as ReactAriaTimeField,
} from "react-aria-components";

interface MyTimeFieldProps<T extends TimeValue> extends TimeFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export default function TimeField<T extends TimeValue>({
  label,
  description,
  errorMessage,
  ...props
}: MyTimeFieldProps<T>) {
  return (
    <ReactAriaTimeField {...props} className="flex flex-col gap-2">
      <Label>{label}</Label>
      <DateInput className="flex flex-row gap-2">
        {segment => (
          <DateSegment
            segment={segment}
            className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-gray-600 focus:text-white caret-transparent placeholder-shown:italic"
          />
        )}
      </DateInput>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </ReactAriaTimeField>
  );
}
