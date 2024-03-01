import React from "react";

import type {
  DatePickerProps,
  DateValue,
  ValidationResult,
} from "react-aria-components";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  Text,
  DatePicker as ReactAriaDatePicker,
} from "react-aria-components";
import Button from "../button";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

interface MyDatePickerProps<T extends DateValue> extends DatePickerProps<T> {
  label?: string;
  name?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export default function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: MyDatePickerProps<T>) {
  return (
    <ReactAriaDatePicker
      {...props}
      className="group flex flex-col gap-1 w-full"
    >
      <Label>{label}</Label>
      <Group className="flex rounded-lg bg-white/90 focus-within:bg-white group-open:bg-white transition pl-3 shadow-md text-gray-700 focus-visible:ring-2 ring-black">
        <DateInput className="flex flex-1 py-2">
          {segment => (
            <DateSegment
              segment={segment}
              className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-gray-600 focus:text-white caret-transparent placeholder-shown:italic"
            />
          )}
        </DateInput>
        <Button className="outline-none px-3 flex flex-col items-center text-gray-700 transition border-0 border-solid border-l border-l-purple-200 bg-transparent rounded-r-lg pressed:bg-purple-100 focus-visible:ring-2 ring-black">
          <ChevronUpIcon />
          <ChevronDownIcon />
        </Button>
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError className="text-red-600 text-base text-nowrap">
        {errorMessage}
      </FieldError>
      <Popover
        className={({ isEntering, isExiting }) => `
        overflow-auto rounded-lg drop-shadow-lg ring-1 ring-black/10 bg-white 
        ${
          isEntering
            ? "animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 ease-out duration-200"
            : ""
        }
        ${
          isExiting
            ? "animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 ease-in duration-150"
            : ""
        }
      `}
      >
        <Dialog className="p-6 w-max h-max text-gray-600">
          <Calendar>
            <header className="flex items-center gap-1 pb-4 px-1 font-serif w-full">
              <Heading className="flex-1 font-semibold text-2xl ml-2" />
              <Button
                slot="previous"
                className="w-9 h-9 w-max outline-none cursor-default bg-transparent text-gray-600 border-0 rounded-full flex items-center justify-center hover:bg-gray-100 pressed:bg-gray-200 focus-visible:ring ring-violet-600/70 ring-offset-2"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                slot="next"
                className="w-9 h-9 w-max outline-none cursor-default bg-transparent text-gray-600 border-0 rounded-full flex items-center justify-center hover:bg-gray-100 pressed:bg-gray-200 focus-visible:ring ring-violet-600/70 ring-offset-2"
              >
                <ChevronRightIcon />
              </Button>
            </header>
            <CalendarGrid className="border-spacing-1 border-separate">
              {date => (
                <CalendarCell
                  date={date}
                  className="w-9 h-9 outline-none cursor-default rounded-full flex items-center justify-center outside-month:text-gray-300 hover:bg-gray-100 pressed:bg-gray-200 selected:bg-gray-500 selected:text-white focus-visible:ring ring-violet-600/70 ring-offset-2"
                />
              )}
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </ReactAriaDatePicker>
  );
}
