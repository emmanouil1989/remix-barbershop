import React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

export type SelectProps = {
  selectedValue?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  options: Array<RadixSelect.SelectItemProps>;
};

export default function Select({
  selectedValue,
  placeholder,
  onChange,
  options,
}: SelectProps) {
  return (
    <RadixSelect.Root value={selectedValue} onValueChange={onChange}>
      <RadixSelect.Trigger
        aria-label={selectedValue}
        className="flex flex-row gap-4  font-bold py-2 px-4 rounded items-center justify-between outline-none cursor-pointer max-w-[400px] shadow-sm bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDownIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className=" w-full max-h-[400px] overflow-x-hidden overflow-y-auto border-solid border border-gray-600 absolute z-10 bg-white">
          <RadixSelect.ScrollUpButton>
            <ChevronUpIcon />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport>
            <RadixSelect.Group>
              {options.map(option => {
                return (
                  <SelectItem
                    className="flex flex-row items-center gap-4 outline-none w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-white border-b border-solid border-gray-600 last:border-b-0"
                    {...option}
                    key={option.value}
                    aria-label={option.textValue}
                  >
                    {option.textValue}
                  </SelectItem>
                );
              })}
            </RadixSelect.Group>
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton>
            <ChevronDownIcon />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof RadixSelect.Item>,
  React.ComponentPropsWithRef<typeof RadixSelect.Item>
>(({ children, ...props }, forwardedRef) => {
  return (
    <RadixSelect.Item {...props} ref={forwardedRef}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator>
        <CheckIcon />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

SelectItem.displayName = "SelectItem";
