import React from "react";
import {
  getListOfSevenDayLists,
  getMonthNumber,
  useCalendarContext,
} from "~/utils/calendarUtils";
import type { BookingsWithDaysAndHours } from "../Scheduler";

type MonthViewProps = {
  bookingsWithDaysAndHours: BookingsWithDaysAndHours;
};
export default function MonthView({
  bookingsWithDaysAndHours,
}: MonthViewProps) {
  const { dateState } = useCalendarContext();
  const [date] = dateState;
  const arrayOfMonthDays = getListOfSevenDayLists(date);

  return (
    <div className="flex flex-col w-full h-full  mb-4">
      {arrayOfMonthDays.map((week, index) => (
        <div
          key={`day-${index}`}
          className="grid grid-cols-7 first:border-t  border-gray-600 border-l "
        >
          {week.map(dayRecord => {
            const isDuplicated = dayRecord.month !== getMonthNumber(date);
            return (
              <div
                className="w-full h-[200px] border-b border-r border-gray-600 p-2 flex flex-col gap-1 "
                key={dayRecord.day}
              >
                <div
                  className={`flex justify-center w-full ${
                    isDuplicated ? "text-gray-400" : ""
                  }`}
                >
                  {dayRecord.day}
                </div>
                <ul className="flex flex-col justify-center overflow-x-hidden overflow-y-auto">
                  {bookingsWithDaysAndHours?.[dayRecord.month]?.[
                    dayRecord.day
                  ] &&
                    Object.keys(
                      bookingsWithDaysAndHours[dayRecord.month][dayRecord.day],
                    ).map(hour => {
                      const booking =
                        bookingsWithDaysAndHours?.[dayRecord.month]?.[
                          dayRecord.day
                        ]?.[hour];

                      return (
                        <li
                          key={hour}
                          className="flex flex-row items-center gap-2"
                        >
                          <div className=" border border-4 border-solid border-gray-600 rounded" />
                          <span className="text-sm font-bold">{hour}</span>
                          <span className="text-sm">
                            {booking?.user?.firstName}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
