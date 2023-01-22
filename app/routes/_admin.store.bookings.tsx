import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import type { DropdownOption } from "~/components/Dropdown/Dropdown";
import Dropdown from "~/components/Dropdown/Dropdown";
import Button from "~/components/button/Button";
import Calendar from "~/components/Calendar/Calendar";
import {
  CalendarContextProvider,
  getHoursOfTheDay,
  getWeekDatesAndNames,
  useCalendarContext,
} from "~/utils/calendar";

type TimeViewsType = "Month" | "Week";

export default function AdminStoreBookings() {
  const timeViewState = useState<TimeViewsType>("Month");
  return (
    <div className={"flex h-full w-full flex-col py-4 gap-4"}>
      <AppointmentScheduleHeader timeViewState={timeViewState} />

      <CalendarContextProvider>
        <div className={"grid grid-cols-[max-content_1fr] gap-4"}>
          <Calendar />
          <Scheduler />
        </div>
      </CalendarContextProvider>
    </div>
  );
}

function Scheduler() {
  const { dayParam, monthParam, yearParam } = useCalendarContext();
  const date = dayParam
    ? new Date(yearParam, monthParam, dayParam)
    : new Date();
  const weekDatesAndNamesArray = getWeekDatesAndNames(date);
  return (
    <div className={"flex flex-col w-full h-full"}>
      <ScheduleHeader weekDatesAndNamesArray={weekDatesAndNamesArray} />
      <ScheduleBody weekDatesAndNamesArray={weekDatesAndNamesArray} />
    </div>
  );
}

type ScheduleBodyProps = ScheduleHeaderProps;
function ScheduleBody({ weekDatesAndNamesArray }: ScheduleBodyProps) {
  const dayHours = getHoursOfTheDay();

  return (
    <div
      className={
        "flex  flex-row h-full w-full overflow-x-hidden overflow-y-auto max-h-[calc(100vh-20rem)]"
      }
    >
      {[
        <div key={"extra-column"} className={"grid grid-flow-row"}>
          {dayHours.map(hour => (
            <div
              key={hour}
              className={`flex flex-col w-4 h-16 border-t border-solid border-gray-600`}
            ></div>
          ))}
        </div>,

        ...weekDatesAndNamesArray.map(({ weekDay }, index) => (
          <div key={weekDay} className={"grid grid-flow-row w-full h-full"}>
            {dayHours.map(hour => (
              <div
                key={hour}
                className={`flex flex-col ${
                  index === weekDatesAndNamesArray.length - 1
                    ? "border-r border-solid border-gray-600"
                    : "border-r-0"
                } border-solid [&:not(:last-child)]:border-b-0   border border-gray-600 w-full h-16`}
              />
            ))}
          </div>
        )),
      ]}
    </div>
  );
}

type ScheduleHeaderProps = {
  weekDatesAndNamesArray: ReturnType<typeof getWeekDatesAndNames>;
};
function ScheduleHeader({ weekDatesAndNamesArray }: ScheduleHeaderProps) {
  return (
    <div className={"flex"}>
      {[
        <div key={"extra"} className={"flex flex-col"}>
          <div className={"flex flex-col  items-center"}></div>
          <div className={"h-6 w-4"} />
        </div>,
        ...weekDatesAndNamesArray.map(weekDateAndNameRecord => (
          <div
            key={weekDateAndNameRecord.weekDay}
            className={"flex flex-col w-full h-full"}
          >
            <div
              key={weekDateAndNameRecord.weekDay}
              className={"flex flex-col w-full h-15    items-center"}
            >
              <h2 className={"text-sm"}>{weekDateAndNameRecord.weekInitial}</h2>
              <h2>{weekDateAndNameRecord.weekDay}</h2>
            </div>
            <div className={"h-6 w-4 border-l border-solid border-gray-600"} />
          </div>
        )),
      ]}
    </div>
  );
}

const useDropdownOptions = (): Array<DropdownOption> => {
  return [
    { value: "Month", label: "Month View" },
    { value: "Week", label: "Week View" },
  ];
};

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
    <div className={"flex flex-row items-center justify-end gap-4 pb-4"}>
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
