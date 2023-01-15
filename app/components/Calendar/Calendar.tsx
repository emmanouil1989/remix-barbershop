import { useState } from "react";
import {
  getCurrentMonth,
  getCurrentYear,
  getMonthDays,
  getNextMonth,
  getPreviousMonth,
} from "~/utils/calendar";

export default function Calendar() {
  const [date, setDate] = useState(new Date());
  const month = getCurrentMonth(date);
  const year = getCurrentYear(date);
  const arrayOfMonthDays = getMonthDays(date);
  const weekDaysInitialsArray = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <div
      className={
        "flex flex-col max-w-[300px] py-4 border border-solid border-gray-600"
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
                  className={
                    "table-cell text-sm align-middle hover:bg-gray-200 hover:rounded-full cursor-pointer"
                  }
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
