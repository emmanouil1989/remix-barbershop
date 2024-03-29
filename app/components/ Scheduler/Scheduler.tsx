import {
  addHalfHourToAmPmDay,
  getGMTOffset,
  getHoursOfTheDay,
  getWeekDatesAndNames,
} from "~/utils/calendarUtils";
import React from "react";
import type { SerializeFrom } from "@remix-run/node";
import type { Prisma } from "@prisma/client";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

type BookingServices = Prisma.BookingGetPayload<{
  include: {
    user: true;
    services: {
      include: {
        storeService: true;
      };
    };
  };
}>;
export type HourBooking = Record<string, BookingServices>;
export type BookingsWithDaysAndHours = SerializeFrom<
  Record<string, Record<string, HourBooking>>
>;
type ScheduleProps = {
  bookingsWithDaysAndHours: BookingsWithDaysAndHours;
  dayParam: string;
  monthParam: string;
  yearParam: string;
  timeView: "Week" | "Month";
};
export default function Scheduler({
  bookingsWithDaysAndHours,
  dayParam,
  monthParam,
  yearParam,
  timeView,
}: ScheduleProps) {
  const date = dayParam
    ? new Date(Number(yearParam), Number(monthParam) - 1, Number(dayParam))
    : new Date();
  const weekDatesAndNamesArray = getWeekDatesAndNames(date);
  if (timeView === "Week") {
    return (
      <WeekView
        dayParam={dayParam}
        monthParam={monthParam}
        yearParam={yearParam}
        timeView={timeView}
        bookingsWithDaysAndHours={bookingsWithDaysAndHours}
        weekDatesAndNamesArray={weekDatesAndNamesArray}
      />
    );
  }

  return (
    <MonthView
      bookingsWithDaysAndHours={bookingsWithDaysAndHours}
      date={date}
    />
  );
}

export type ScheduleBodyProps = ScheduleHeaderProps & {
  bookingsWithDaysAndHours: BookingsWithDaysAndHours;
  monthParam: string;
  yearParam: string;
  timeView: "Week" | "Month";
};
export function ScheduleBody({
  weekDatesAndNamesArray,
  bookingsWithDaysAndHours,
}: ScheduleBodyProps) {
  const dayHours = getHoursOfTheDay();
  return (
    <div className="flex  flex-row h-full w-full overflow-x-hidden overflow-y-auto">
      {[
        <div
          key="times"
          className="grid grid-flow-row -mt-[0.7rem] grid-cols-[3rem]"
        >
          {dayHours.map(hour => {
            return (
              <div
                className="flex flex-col items-center  w-full h-16 "
                key={hour}
              >
                <span className="text-sm">{hour}</span>
              </div>
            );
          })}
        </div>,
        <div key="extra-column" className="grid grid-flow-row">
          {dayHours.map(hour => (
            <div
              key={hour}
              className="flex flex-col w-4 h-16 border-t border-solid border-gray-600"
            />
          ))}
        </div>,
        ...weekDatesAndNamesArray.map(({ weekDay, month }, index) => (
          <div key={weekDay} className="grid grid-flow-row w-full h-full">
            {[
              ...dayHours.map(hour => {
                const booking =
                  bookingsWithDaysAndHours?.[month]?.[weekDay]?.[hour];
                const halfHourBooking =
                  bookingsWithDaysAndHours?.[month]?.[weekDay]?.[
                    addHalfHourToAmPmDay(hour)
                  ];
                return (
                  <div
                    key={hour}
                    className={`flex flex-col ${
                      index === weekDatesAndNamesArray.length - 1
                        ? "border-r border-solid border-gray-600"
                        : "border-r-0"
                    } border-solid [&:not(:last-child)]:border-b-0  border border-gray-600 pl-1 min-w-[6rem] gap-1 w-full h-16`}
                  >
                    <div
                      className={`flex py-0.5 px-1 text-white mt-1 text-sm ${
                        booking && booking.start
                          ? "bg-gray-600 cursor-pointer"
                          : ""
                      }  w-full items-center max-w-[8.5rem] h-full`}
                    >
                      {booking?.user.firstName && (
                        <span className="truncate text-[0.65rem]">
                          {`${booking?.user?.firstName} - ${booking?.services[0].storeService.name}`}
                        </span>
                      )}
                    </div>

                    <div
                      className={`flex py-0.5 px-1 mb-1 text-white ${
                        halfHourBooking && halfHourBooking.start
                          ? "bg-gray-600 cursor-pointer"
                          : ""
                      } w-full items-center max-w-[8.5rem]  h-full`}
                    >
                      {halfHourBooking?.user.firstName && (
                        <span className="truncate text-[0.65rem]">
                          {`${halfHourBooking?.user?.firstName} - ${halfHourBooking?.services[0].storeService.name}`}
                        </span>
                      )}
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

export type ScheduleHeaderProps = {
  weekDatesAndNamesArray: ReturnType<typeof getWeekDatesAndNames>;
  dayParam: string;
};
export function ScheduleHeader({
  weekDatesAndNamesArray,
  dayParam,
}: ScheduleHeaderProps) {
  return (
    <div className="flex">
      {[
        <div
          key="times-header"
          className="grid grid-flow-row -mt-[0.7rem] items-end  grid-cols-[3rem]"
        >
          <div className="flex flex-col items-center gap-0.5  w-full h-16 ">
            <span className="text-sm">GMT</span>
            <span className="text-sm">{getGMTOffset()}</span>
          </div>
        </div>,
        <div key="extra-column-header" className="grid grid-flow-row">
          <div className="flex flex-col w-4 h-16" />
        </div>,
        ...weekDatesAndNamesArray.map(weekDateAndNameRecord => {
          const isSelected = Number(dayParam) === weekDateAndNameRecord.weekDay;

          return (
            <div
              key={weekDateAndNameRecord.weekDay}
              className="flex flex-col w-full h-full"
            >
              <div
                key={weekDateAndNameRecord.weekDay}
                className="flex flex-col w-full h-15    items-center"
              >
                <h2 className="text-sm">{weekDateAndNameRecord.weekInitial}</h2>
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
              <div className="h-6 w-4 border-l border-solid border-gray-600" />
            </div>
          );
        }),
      ]}
    </div>
  );
}
