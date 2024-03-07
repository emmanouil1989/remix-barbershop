import React, { useState } from "react";
import {
  getCurrentMonth,
  getCurrentYear,
  getListOfSevenDayLists,
  getMonthNumber,
  getNextMonth,
  getPreviousMonth,
  weekDaysInitialsArray,
} from "~/utils/calendarUtils";
import { useNavigate } from "@remix-run/react";
import { getDate, getDay } from "date-fns";

export default function Calendar({
  date,
  timeView,
}: {
  date: Date;
  timeView: "Week" | "Month";
}) {
  const navigate = useNavigate();

  const month = getCurrentMonth(date);
  const year = getCurrentYear(date);
  const arrayOfMonthDays = getListOfSevenDayLists(date);
  const dayParam = getDate(date).toString();

  const monthParam = getMonthNumber(date).toString();
  const setDate = (date: Date) => {
    navigate(
      `/store/bookings?year=${date.getFullYear()}&month=${date.getMonth()}&day=${date.getDate()}`,
    );
  };
  return (
    <div className="flex flex-col max-w-[300px] max-h-[310px] mt-16 p-4 border border-solid border-gray-600">
      <div className="flex flex-row items-center justify-between mx-4 pl-1">
        <div className="flex flex-row gap-2 items-center">
          <h2>{month}</h2>
          <h2>{year}</h2>
        </div>

        <div className="flex flex-row items-center gap-4">
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
      <div className="table border-spacing-1 border-separate w-full text-center table-fixed py-4">
        <div className="table-row h-[28px]">
          {weekDaysInitialsArray.map((day, index) => (
            <span key={day + index} className="table-cell text-sm align-middle">
              {day}
            </span>
          ))}
        </div>
        <div className="table-row-group">
          {arrayOfMonthDays.map((week, index) => (
            <div className="table-row h-[28px]" key={index}>
              {week.map((dayRecord, index) => {
                const isDuplicated = dayRecord.month !== getMonthNumber(date);

                const isSelected =
                  Number(dayParam) === dayRecord.day &&
                  getMonthNumber(date) === Number(monthParam) &&
                  !isDuplicated;

                function onDateSelect() {
                  setDate(
                    new Date(
                      dayRecord.year,
                      dayRecord.month - 1,
                      dayRecord.day,
                    ),
                  );
                  navigate(
                    `/store/bookings?year=${dayRecord.year}&month=${dayRecord.month}&day=${dayRecord.day}&tableView=${timeView}`,
                  );
                }
                return (
                  <div
                    onClick={onDateSelect}
                    key={dayRecord.day + index}
                    className={`table-cell text-sm align-middle ${
                      !isSelected ? "hover:bg-gray-200" : ""
                    } hover:rounded-full cursor-pointer ${
                      isSelected ? "isSelected" : ""
                    } ${isDuplicated ? "text-gray-400" : ""}`}
                  >
                    {dayRecord.day}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
