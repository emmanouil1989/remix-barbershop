import React from "react";
import type {
  ComboBoxProps,
  ListBoxItemProps,
  ValidationResult,
} from "react-aria-components";
import {
  ComboBox as ReactAriaCombobox,
  FieldError,
  Label,
  ListBox,
  Popover,
  Text,
  ListBoxItem,
  Group,
  Input,
  Button,
} from "react-aria-components";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

type ComboBoxValue = {
  value: string;
  textValue: string;
};
interface MyComboBoxProps<T extends ComboBoxValue>
  extends Omit<ComboBoxProps<T>, "children"> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export default function ComboBox<T extends ComboBoxValue>({
  label,
  description,
  errorMessage,
  children,
  ...props
}: MyComboBoxProps<T>) {
  return (
    <ReactAriaCombobox {...props}>
      <Label>{label}</Label>
      <Group className="flex rounded-lg bg-white bg-opacity-90 focus-within:bg-opacity-100 transition shadow-md ring-1 ring-black/10 focus-visible:ring-2 focus-visible:ring-black">
        <Input className="flex-1  border-none py-2 px-2 leading-5 text-gray-900 bg-transparent outline-none text-base" />
        <Button className="flex flex-row gap-4  font-bold py-2 px-4 rounded items-center justify-between outline-none cursor-pointer max-w-[400px] shadow-sm bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-white text-black">
          <ChevronDownIcon />
        </Button>
      </Group>

      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="max-h-60 w-[--trigger-width] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out">
        <ListBox>{children}</ListBox>
      </Popover>
    </ReactAriaCombobox>
  );
}

export function ComboboxItem({ children, ...props }: ListBoxItemProps) {
  return (
    <ListBoxItem
      {...props}
      className="flex flex-row items-center gap-4 outline-none w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-white border-b border-solid border-gray-600 last:border-b-0"
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
