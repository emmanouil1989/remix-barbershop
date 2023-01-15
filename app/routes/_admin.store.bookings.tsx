import { addMonths, getYear, getDaysInMonth } from "date-fns";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { DropdownOption } from "~/components/Dropdown/Dropdown";
import Dropdown from "~/components/Dropdown/Dropdown";
import Button from "~/components/button/Button";

type TimeViewsType = "Month" | "Week";

export default function AdminStoreBookings() {
  const timeViewState = useState<TimeViewsType>("Month");
  return (
    <div className={"flex h-full w-full flex-col py-8 gap-4"}>
      <AppointmentScheduleHeader timeViewState={timeViewState} />
      <Calendar />
    </div>
  );
}

function Calendar() {
  const [date, setDate] = useState(new Date());
  const month = getCurrentMonth(date);
  const year = getCurrentYear(date);
  const arrayOfMonthDays = getMonthDays(date);
  const weekDaysInitialsArray = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <div
      className={
        "flex flex-col max-w-[400px] py-4 border border-solid border-gray-600"
      }
    >
      <div className={"flex flex-row items-center justify-between mx-4 pl-1"}>
        <div className={"flex flex-row gap-2 items-center"}>
          <h2>{month}</h2>
          <h2>{year}</h2>
        </div>

        <div className={"flex flex-row items-center gap-4"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setDate(getPreviousMonth(date))}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setDate(getNextMonth(date))}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
      <div className={"table w-full text-center table-fixed py-4"}>
        <div className={"table-row h-[28px]"}>
          {weekDaysInitialsArray.map((day, index) => (
            <span
              key={day + index}
              className={"table-cell text-sm align-middle"}
            >
              {day}
            </span>
          ))}
        </div>
        <div className={"table-row-group"}>
          {arrayOfMonthDays.map((week, index) => (
            <div className={"table-row h-[28px]"} key={index}>
              {week.map((day, index) => (
                <span
                  key={day + index}
                  className={"table-cell text-sm align-middle"}
                >
                  {day}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const useDropdownOptions = (): Array<DropdownOption> => {
  return [
    { value: "Month", label: "Month View" },
    { value: "Week", label: "Week View" },
  ];
};

//function to use date-fns to get current month

function getCurrentMonth(date: Date) {
  return date.toLocaleString("default", { month: "long" });
}

function getMonthDays(date: Date) {
  const daysInMonth = getDaysInMonth(date);
  const dividedBySeven = Math.ceil(daysInMonth / 7);
  let index = 0;
  const response = [];
  for (let i = 1; i <= dividedBySeven; i++) {
    const groupOfSevenDays = [];

    for (let j = index + 1; j <= index + 7; j++) {
      if (j <= daysInMonth) {
        groupOfSevenDays.push(j);
      }
    }
    response.push(groupOfSevenDays);
    index = index + 7;
  }
  return response;
}

function getCurrentYear(date: Date) {
  return getYear(date);
}

function getNextMonth(date: Date) {
  return addMonths(date, 1);
}

function getPreviousMonth(date: Date) {
  return addMonths(date, -1);
}

//function to split the days of month by 7 days

type AppointmentScheduleHeaderProps = {
  timeViewState: [TimeViewsType, Dispatch<SetStateAction<TimeViewsType>>];
};
const isTypeViewType = (value: unknown): value is TimeViewsType => {
  return value === "Month" || value === "Week";
};
function AppointmentScheduleHeader({
  timeViewState,
}: AppointmentScheduleHeaderProps) {
  const options = useDropdownOptions();
  const [timeView, setTimeView] = timeViewState;
  return (
    <div
      className={
        "flex flex-row items-center justify-end gap-4 border border-solid border-gray-600 p-4"
      }
    >
      <Dropdown
        selectedValue={timeView}
        onChange={(value: string) => {
          if (isTypeViewType(value)) {
            setTimeView(value);
          }
        }}
        options={options}
      />
      <Button>Add Booking</Button>
    </div>
  );
}
