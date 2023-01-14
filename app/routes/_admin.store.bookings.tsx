import { addMonths, getYear } from "date-fns";
import { useState } from "react";

export default function AdminStoreBookings() {
  return (
    <div className={"flex h-full w-full flex-col py-8"}>
      <AppointmentScheduleHeader />
    </div>
  );
}

//function to use date-fns to get current month
function getCurrentMonth(date: Date) {
  return date.toLocaleString("default", { month: "long" });
}

function getCurrentYear(date: Date) {
  return getYear(date);
}

function getNextMonth(date: Date) {
  return addMonths(date, 1);
}

function getPreviousMonth(date: Date) {
  return addMonths(date, -1);
}

function AppointmentScheduleHeader() {
  const [date, setDate] = useState(new Date());
  const currentMonth = getCurrentMonth(date);
  const year = getCurrentYear(date);
  function onNextMonth(date: Date) {
    const nextMonth = getNextMonth(date);
    setDate(nextMonth);
  }
  function onPreviousMonth(date: Date) {
    const previousMonth = getPreviousMonth(date);
    setDate(previousMonth);
  }
  return (
    <div
      className={
        "flex flex-row justify-between items-center border border-solid border-gray-600 p-4"
      }
    >
      <button className={"button"} onClick={() => onPreviousMonth(date)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 className={"text-2xl"}>
        {currentMonth} {year}
      </h1>
      <button className={"button"} onClick={() => onNextMonth(date)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
