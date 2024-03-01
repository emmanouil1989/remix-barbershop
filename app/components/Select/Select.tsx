import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import React from "react";

import type {
  ListBoxItemProps,
  SelectProps,
  ValidationResult,
  Key,
} from "react-aria-components";
import {
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Text,
} from "react-aria-components";
import Button from "~/components/button/Button";

type SelectValue = {
  value: string;
  textValue: string;
};
type Props<T extends SelectValue> = {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  selectedValue?: Key;
  formId?: string;
  onChange?: (value: Key) => void;
} & Omit<SelectProps<T>, "children">;

export default function ReactAriaSelect<T extends SelectValue>({
  label,
  description,
  errorMessage,
  items,
  selectedValue,
  onChange,
  ...props
}: Props<T>) {
  return (
    <Select {...props} selectedKey={selectedValue} onSelectionChange={onChange}>
      <Label>{label}</Label>
      <Button className="flex w-full flex-row gap-4  font-bold py-2 px-4 rounded items-center justify-between outline-none cursor-pointer max-w-[400px] shadow-sm bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-white text-black">
        <SelectValue />
        <ChevronDownIcon />
      </Button>
      {description && <Text slot="description">{description}</Text>}
      <FieldError className="text-red-600 text-base text-nowrap">
        {errorMessage}
      </FieldError>
      <Popover className="max-h-60 w-[--trigger-width] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out outline-none">
        <ListBox items={items} className="outline-none">
          {item => <SelectItem id={item.value}>{item.textValue}</SelectItem>}
        </ListBox>
      </Popover>
    </Select>
  );
}

function SelectItem({ children, ...props }: ListBoxItemProps) {
  return (
    <ListBoxItem
      {...props}
      className="flex flex-row items-center justify-between gap-4 outline-none w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-white border-b border-solid border-gray-600 last:border-b-0"
    >
      {({ isSelected }) => (
        <>
          {children}
          {isSelected && <CheckIcon />}
        </>
      )}
    </ListBoxItem>
  );
}
