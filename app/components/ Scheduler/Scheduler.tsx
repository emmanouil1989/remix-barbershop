import {
  addHalfHourToAmPmDay,
  getGMTOffset,
  getHoursOfTheDay,
  getWeekDatesAndNames,
  useCalendarContext,
} from "~/utils/calendarUtils";
import React from "react";
import type { Booking } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

export type HourBooking = Record<string, Booking>;
type BookingsWithDaysAndHours = SerializeFrom<Record<string, HourBooking>>;
type ScheduleProps = {
  bookingsWithDaysAndHours: BookingsWithDaysAndHours;
};
export default function Scheduler({ bookingsWithDaysAndHours }: ScheduleProps) {
  const { dayParam, monthParam, yearParam } = useCalendarContext();
  const date = dayParam
    ? new Date(Number(yearParam), Number(monthParam) - 1, Number(dayParam))
    : new Date();
  const weekDatesAndNamesArray = getWeekDatesAndNames(date);
  return (
    <div className={"flex flex-col w-full h-full"}>
      <ScheduleHeader weekDatesAndNamesArray={weekDatesAndNamesArray} />
      <ScheduleBody
        weekDatesAndNamesArray={weekDatesAndNamesArray}
        bookingsWithDaysAndHours={bookingsWithDaysAndHours}
      />
    </div>
  );
}

type ScheduleBodyProps = ScheduleHeaderProps & {
  bookingsWithDaysAndHours: BookingsWithDaysAndHours;
};
function ScheduleBody({
  weekDatesAndNamesArray,
  bookingsWithDaysAndHours,
}: ScheduleBodyProps) {
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
              ...dayHours.map(hour => {
                const booking = bookingsWithDaysAndHours?.[weekDay]?.[hour];
                const halfHourBooking =
                  bookingsWithDaysAndHours?.[weekDay]?.[
                    addHalfHourToAmPmDay(hour)
                  ];
                return (
                  <div
                    key={hour}
                    className={`flex flex-col ${
                      index === weekDatesAndNamesArray.length - 1
                        ? "border-r border-solid border-gray-600"
                        : "border-r-0"
                    } border-solid [&:not(:last-child)]:border-b-0  border border-gray-600 max-w-[7rem] gap-1 w-full h-16`}
                  >
                    <div
                      className={`flex p-1 text-white mt-1 text-sm ${
                        booking && booking.start
                          ? "bg-gray-600 cursor-pointer"
                          : ""
                      }  w-11/12 h-full`}
                    >
                      <span className={"truncate"}>{booking?.start}</span>
                    </div>

                    <div
                      className={`flex p-1 mb-1 text-white text-sm ${
                        halfHourBooking && halfHourBooking.start
                          ? "bg-gray-600 cursor-pointer"
                          : ""
                      } w-11/12 h-full`}
                    >
                      <span className={"truncate w-full h-full"}>
                        {halfHourBooking?.start}
                      </span>
                    </div>
                  </div>
                );
              }),
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
        <div
          key={"times-header"}
          className={"grid grid-flow-row -mt-[0.7rem]  w-96"}
        >
          <div className={"flex flex-col items-center gap-0.5  w-full h-16 "}>
            <span className={"text-sm"}>GMT</span>
            <span className={"text-sm"}>{getGMTOffset()}</span>
          </div>
        </div>,
        <div key={"extra-column-header"} className={"grid grid-flow-row"}>
          <div className={`flex flex-col w-4 h-16`} />
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
