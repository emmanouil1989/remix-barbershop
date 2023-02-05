import {
  getHoursOfTheDay,
  getWeekDatesAndNames,
  useCalendarContext,
} from "~/utils/calendar";
import React from "react";

export default function Scheduler() {
  const { dayParam, monthParam, yearParam } = useCalendarContext();
  const date = dayParam
    ? new Date(Number(yearParam), Number(monthParam) - 1, Number(dayParam))
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
        <div key={"times"} className={"grid grid-flow-row -mt-[0.7rem]  w-96"}>
          {dayHours.map(hour => {
            return (
              <div
                className={"flex flex-col items-center  w-full h-16 "}
                key={hour}
              >
                <span className={"text-sm"}>{hour}</span>
              </div>
            );
          })}
        </div>,
        <div key={"extra-column"} className={"grid grid-flow-row"}>
          {dayHours.map(hour => (
            <div
              key={hour}
              className={`flex flex-col w-4 h-16 border-t border-solid border-gray-600`}
            />
          ))}
        </div>,
        ...weekDatesAndNamesArray.map(({ weekDay }, index) => (
          <div key={weekDay} className={"grid grid-flow-row w-full h-full"}>
            {[
              ...dayHours.map(hour => (
                <div
                  key={hour}
                  className={`flex flex-col ${
                    index === weekDatesAndNamesArray.length - 1
                      ? "border-r border-solid border-gray-600"
                      : "border-r-0"
                  } border-solid [&:not(:last-child)]:border-b-0   border border-gray-600 w-full h-16`}
                />
              )),
            ]}
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
  const { dayParam } = useCalendarContext();
  return (
    <div className={"flex"}>
      {[
        <div key={"extra"} className={"flex flex-col"}>
          <div className={"flex"} />
          <div className={"h-6 w-[66.56px]"} />
        </div>,
        ...weekDatesAndNamesArray.map(weekDateAndNameRecord => {
          const isSelected = Number(dayParam) === weekDateAndNameRecord.weekDay;

          return (
            <div
              key={weekDateAndNameRecord.weekDay}
              className={"flex flex-col w-full h-full"}
            >
              <div
                key={weekDateAndNameRecord.weekDay}
                className={"flex flex-col w-full h-15    items-center"}
              >
                <h2 className={"text-sm"}>
                  {weekDateAndNameRecord.weekInitial}
                </h2>
                <h2
                  className={`w-12 flex justify-center items-center ${
                    isSelected
                      ? "bg-gray-500 text-white font-bold rounded-full"
                      : ""
                  } `}
                >
                  {weekDateAndNameRecord.weekDay}
                </h2>
              </div>
              <div
                className={"h-6 w-4 border-l border-solid border-gray-600"}
              />
            </div>
          );
        }),
      ]}
    </div>
  );
}
