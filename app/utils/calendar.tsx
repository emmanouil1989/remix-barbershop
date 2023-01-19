import {
  addMonths,
  getDaysInMonth,
  getYear,
  getMonth,
  getWeek,
  getDate,
  setDate,
  getWeekOfMonth,
  getDay,
} from "date-fns";
import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useInitialDateState } from "~/components/Calendar/Calendar";

export function getCurrentMonth(date: Date) {
  return date.toLocaleString("default", { month: "long" });
}

export function getMonthNumber(date: Date) {
  return getMonth(date) + 1;
}
export const weekDaysInitialsArray = ["S", "M", "T", "W", "T", "F", "S"];

export function getMonthDays(date: Date) {
  const numberOfDayInMonth = getDaysInMonth(date);
  const numberOfWeeksInMonth = Math.ceil(numberOfDayInMonth / 7);
  let index = 0;
  const listOfSevenDayLists = [];
  for (let weekNumber = 1; weekNumber <= numberOfWeeksInMonth; weekNumber++) {
    const groupOfSevenDays: Array<{
      day: number;
      month: number;
      year: number;
    }> = [];

    for (let dayNumber = index + 1; dayNumber <= index + 7; dayNumber++) {
      if (dayNumber <= numberOfDayInMonth) {
        groupOfSevenDays.push({
          day: dayNumber,
          month: getMonthNumber(date),
          year: getYear(date),
        });
      }
    }
    if (groupOfSevenDays.length < 7) {
      const diff = 7 - groupOfSevenDays.length;
      for (let k = 1; k <= diff; k++) {
        groupOfSevenDays.push({
          day: k,
          month: getMonthNumber(addMonths(date, 1)),
          year: getYear(date),
        });
      }
    }
    listOfSevenDayLists.push(groupOfSevenDays);
    index = index + 7;
  }
  return listOfSevenDayLists;
}

export function getCurrentYear(date: Date) {
  return getYear(date);
}

export function getNextMonth(date: Date) {
  return addMonths(date, 1);
}

export function getPreviousMonth(date: Date) {
  return addMonths(date, -1);
}
//TODO need more work on next year
export function getWeekDatesAndNames(date: Date) {
  console.log("date", date);
  const week = getWeekOfMonth(date);
  console.log("week", week - 1);
  const monthDays = getMonthDays(date);
  console.log("monthDays", monthDays);
  const weekDates = monthDays[week - 1];
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekDates[i].day);
    const weekInitial = day.toLocaleString("default", { weekday: "short" });
    const weekDate = weekDates[i].day;
    weekDays.push({ weekDate, weekInitial });
  }
  return weekDays;
}

type CalendarContextData = ReturnType<typeof useInitialDateState>;
export const CalendarContext = createContext<CalendarContextData | undefined>(
  undefined,
);

type CalendarContextProviderProps = {
  children: ReactNode;
};
export function CalendarContextProvider({
  children,
}: CalendarContextProviderProps) {
  const dateState = useInitialDateState();
  return (
    <CalendarContext.Provider value={{ ...dateState }}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error(
      "useCalendarContext must be used within a CalendarContextProvider",
    );
  }
  return context;
};
