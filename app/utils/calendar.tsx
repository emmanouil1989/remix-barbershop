import { addMonths, getDaysInMonth, getYear, getMonth } from "date-fns";
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
  const daysInMonth = getDaysInMonth(date);
  const dividedBySeven = Math.ceil(daysInMonth / 7);
  let index = 0;
  const response = [];
  for (let i = 1; i <= dividedBySeven; i++) {
    const groupOfSevenDays = [];

    for (let j = index + 1; j <= index + 7; j++) {
      if (j <= daysInMonth) {
        groupOfSevenDays.push(j);
      }
    }
    response.push(groupOfSevenDays);
    index = index + 7;
  }
  return response;
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

export function getWeekDatesAndNames(date: Date) {
  const sunday = new Date(date);
  sunday.setDate(sunday.getDate() - sunday.getDay());
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday);
    day.setDate(day.getDate() + i);
    const weekInitial = day.toLocaleString("default", { weekday: "short" });
    weekDays.push({ day: day.getDate(), weekInitial });
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
