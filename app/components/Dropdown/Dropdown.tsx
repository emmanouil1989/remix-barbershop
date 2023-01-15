import { useState } from "react";

export type DropdownProps = {
  selectedValue?: string;
  onChange: (value: string) => void;
  options: Array<DropdownOption>;
};

export type DropdownOption = {
  value: string;
  label: string;
};

export default function Dropdown({
  selectedValue = "-1",
  options,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const optionsRecord = useOptionsRecord(options);
  const label = optionsRecord[selectedValue];
  return (
    <div className=" relative">
      <div
        className={
          " flex flex-row gap-4  font-bold py-2 px-4 rounded items-center justify-between outline-none cursor-pointer  w-full max-w-[400px] shadow-sm bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <button
          aria-haspopup="true"
          aria-expanded="true"
          className={"text-ellipsis"}
        >
          {label}
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
      {isOpen && (
        <div
          className={
            "block  w-full max-h-[400px] overflow-x-hidden overflow-y-auto border-solid border border-gray-600 absolute z-10 bg-white"
          }
        >
          {options.map(option => {
            return (
              <button
                key={option.value}
                className={
                  "block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-white border-b border-solid border-gray-600 last:border-b-0"
                }
                onClick={() => {
                  setIsOpen(false);
                  onChange(option.value);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const useOptionsRecord = (
  options: Array<DropdownOption>,
): Record<string, string> => {
  return options.reduce((acc: Record<string, string>, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});
};
