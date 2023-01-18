import { useState } from "react";
import {
  getCurrentMonth,
  getCurrentYear,
  getMonthDays,
  getMonthNumber,
  getNextMonth,
  getPreviousMonth,
  useCalendarContext,
  weekDaysInitialsArray,
} from "~/utils/calendar";
import { Link, useSearchParams } from "@remix-run/react";

export default function Calendar() {
  const { dateState, dayParam, monthParam } = useCalendarContext();
  const [date, setDate] = dateState;
  const month = getCurrentMonth(date);
  const year = getCurrentYear(date);
  const arrayOfMonthDays = getMonthDays(date);
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
              {week.map((day, index) => {
                const isSelected =
                  dayParam === day && getMonthNumber(date) === monthParam + 1;
                return (
                  <Link
                    to={`/store/bookings?year=${year}&month=${getMonthNumber(
                      date,
                    )}&day=${day}`}
                    key={day + index}
                    className={`table-cell text-sm align-middle ${
                      !isSelected ? "hover:bg-gray-200" : ""
                    } hover:rounded-full cursor-pointer ${
                      isSelected ? "isSelected" : ""
                    } `}
                  >
                    {day}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function useInitialDateState() {
  const [params] = useSearchParams();
  const yearParam = Number(params.get("year"));
  const monthParam = Number(params.get("month")) - 1;
  const dayParam = Number(params.get("day"));

  let dateParam = undefined;
  if (yearParam && monthParam && dayParam) {
    dateParam = new Date(yearParam, monthParam, dayParam);
  }
  const dateState = useState(dateParam || new Date());
  console.log("dateState", dateState);
  return { dateState, dayParam, monthParam, yearParam };
}
