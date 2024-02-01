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
  console.log({ bookingsWithDaysAndHours });
  const [date] = dateState;
  const arrayOfMonthDays = getListOfSevenDayLists(date);

  return (
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-20rem)]">
      <div>
        {arrayOfMonthDays.map((week, index) => (
          <div
            key={`day-${index}`}
            className="grid grid-cols-7 first:border-t  border-gray-600 border-l "
          >
            {week.map(dayRecord => {
              const isDuplicated = dayRecord.month !== getMonthNumber(date);
              return (
                <div
                  className="w-full h-[200px] border-b border-r border-gray-600 p-2 flex flex-col justify-between gap-1 "
                  key={dayRecord.day}
                >
                  <div
                    className={`flex justify-center w-full ${
                      isDuplicated ? "text-gray-400" : ""
                    }`}
                  >
                    {dayRecord.day}
                  </div>
                  <ul className="flex flex-col gap-1 overflow-x-hidden overflow-y-auto">
                    {bookingsWithDaysAndHours?.[dayRecord.day] &&
                      Object.keys(bookingsWithDaysAndHours[dayRecord.day]).map(
                        hour => {
                          const booking =
                            bookingsWithDaysAndHours?.[dayRecord.day]?.[hour];
                          if (isDuplicated) return null;
                          return (
                            <li
                              key={hour}
                              className="flex flex-row items-center gap-1"
                            >
                              <span>{hour}</span>
                              <span>{booking?.user.firstName}</span>
                            </li>
                          );
                        },
                      )}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}