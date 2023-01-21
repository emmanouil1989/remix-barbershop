import { useState } from "react";
import {
  getCurrentMonth,
  getCurrentYear,
  getListOfSevenDayLists,
  getMonthNumber,
  getNextMonth,
  getPreviousMonth,
  nextYear,
  useCalendarContext,
  weekDaysInitialsArray,
} from "~/utils/calendar";
import { useNavigate, useSearchParams } from "@remix-run/react";

export default function Calendar() {
  const { dateState, dayParam, monthParam } = useCalendarContext();
  const [date, setDate] = dateState;
  const month = getCurrentMonth(date);
  const year = getCurrentYear(date);
  const arrayOfMonthDays = getListOfSevenDayLists(date);
  const navigate = useNavigate();
  return (
    <div
      className={
        "flex flex-col max-w-[300px] max-h-[270px] py-4 border border-solid border-gray-600"
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
      <div
        className={
          "table border-spacing-1 border-separate w-full text-center table-fixed py-4"
        }
      >
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
              {week.map((dayRecord, index) => {
                const isDuplicated = dayRecord.month !== getMonthNumber(date);

                const isSelected =
                  dayParam === dayRecord.day &&
                  getMonthNumber(date) === monthParam + 1 &&
                  !isDuplicated;

                const year =
                  isDuplicated && dayRecord.month === 1
                    ? nextYear(
                        new Date(
                          dayRecord.year,
                          dayRecord.month - 1,
                          dayRecord.day,
                        ),
                      )
                    : dayRecord.year;

                function onDateSelect() {
                  setDate(new Date(year, dayRecord.month - 1, dayRecord.day));
                  navigate(
                    `/store/bookings?year=${year}&month=${dayRecord.month}&day=${dayRecord.day}`,
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
  return { dateState, dayParam, monthParam, yearParam };
}
