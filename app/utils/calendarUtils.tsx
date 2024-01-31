import {
  addMonths,
  getDaysInMonth,
  getYear,
  getMonth,
  getDate,
  getDay,
  getWeekOfMonth,
  addYears,
  getHours,
  getMinutes,
} from "date-fns";
import type { ReactNode } from "react";
import React, { useContext, createContext } from "react";
import { useInitialDateState } from "~/components/Calendar/Calendar";

export function getCurrentMonth(date: Date) {
  return date.toLocaleString("default", { month: "long" });
}

export function getMonthNumber(date: Date) {
  return getMonth(date) + 1;
}
export const weekDaysInitialsArray = ["S", "M", "T", "W", "T", "F", "S"];

type DayRecord = { day: number; month: number; year: number };
function loopThroughDaysInMonthAndGenerateGroupOfSevenDaysAndAddToArray(
  date: Date,
  numberOfDayInMonth: number,
  listOfSevenDayLists: Array<Array<DayRecord>>,
) {
  for (let i = 1; i <= numberOfDayInMonth; i++) {
    const weekOfMonth = getWeekOfMonth(
      new Date(getYear(date), getMonth(date), i),
    );
    const existingArray = listOfSevenDayLists[weekOfMonth - 1];
    const groupOfSevenDays: Array<{
      day: number;
      month: number;
      year: number;
    }> = existingArray || [];

    groupOfSevenDays[getDay(new Date(getYear(date), getMonth(date), i))] = {
      day: i,
      month: getMonthNumber(date),
      year: getYear(date),
    };

    listOfSevenDayLists[weekOfMonth - 1] = groupOfSevenDays;
  }
}

function addDaysFromNextMonthToLastGroupDayArray(
  lastWeekArray: Array<DayRecord>,
  date: Date,
  listOfSevenDayLists: Array<Array<DayRecord>>,
) {
  if (lastWeekArray.length < 7) {
    const diff = 7 - lastWeekArray.length;
    const month = getMonthNumber(date);

    for (let k = 1; k <= diff; k++) {
      lastWeekArray.push({
        day: k,
        month: month === 12 ? 1 : getMonthNumber(date) + 1,
        year: month === 12 ? getYear(addYears(date, 1)) : getYear(date),
      });
    }
  }
  listOfSevenDayLists[listOfSevenDayLists.length - 1] = [...lastWeekArray];
}

function addDaysFromPreviousMonthToFirstGroupArray(
  firstWeekArray: Array<DayRecord>,
  date: Date,
  listOfSevenDayLists: Array<Array<DayRecord>>,
) {
  const firstWeek = firstWeekArray.filter(item => item !== undefined);
  const undefinedCount = 7 - firstWeek.length;

  if (undefinedCount > 0) {
    const previousMonth = getMonthNumber(addMonths(date, -1));
    for (let k = 0; k < undefinedCount; k++) {
      firstWeekArray[k] = {
        day: getDaysInMonth(addMonths(date, -1)) - undefinedCount + k + 1,
        month: previousMonth,
        year:
          previousMonth === 12 ? getYear(addYears(date, -1)) : getYear(date),
      };
    }
    listOfSevenDayLists[0] = [...firstWeekArray];
  }
}
export function getListOfSevenDayLists(date: Date) {
  const numberOfDayInMonth = getDaysInMonth(date);
  const listOfSevenDayLists: Array<Array<DayRecord>> = [];
  loopThroughDaysInMonthAndGenerateGroupOfSevenDaysAndAddToArray(
    date,
    numberOfDayInMonth,
    listOfSevenDayLists,
  );
  const lastWeekArray = listOfSevenDayLists[listOfSevenDayLists.length - 1];
  addDaysFromNextMonthToLastGroupDayArray(
    lastWeekArray,
    date,
    listOfSevenDayLists,
  );

  const firstWeekArray = listOfSevenDayLists[0];
  addDaysFromPreviousMonthToFirstGroupArray(
    firstWeekArray,
    date,
    listOfSevenDayLists,
  );
  return listOfSevenDayLists;
}
export function nextYear(date: Date) {
  return getYear(addMonths(date, 12));
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

export function getWeekNumberInMonth(date: Date) {
  const day = getDate(date);
  //which week of the month is the day in
  return Math.ceil(day / 7);
}
export function getWeekDatesAndNames(date: Date) {
  const week = getWeekOfMonth(date);
  const listOfSevenDayLists = getListOfSevenDayLists(date);
  const weekDates = listOfSevenDayLists[week - 1];
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const weekDayRecord = weekDates[i];
    const day = new Date(
      weekDayRecord.year,
      weekDayRecord.month - 1,
      weekDayRecord.day,
    );
    const weekInitial = day.toLocaleString("default", { weekday: "short" });
    const weekDay = weekDates[i].day;
    const month = weekDates[i].month;
    weekDays.push({ weekDay, month, weekInitial });
  }
  return weekDays;
}

export function getHourFromDate(date: Date) {
  const hour = getHours(date);
  return convertHourToAmPm(hour, isHalfHour(date));
}

//check if date is half hour
export function isHalfHour(date: Date) {
  const minutes = getMinutes(date);
  return minutes === 30;
}

export function addHalfHourToAmPmDay(aMpMString: string) {
  const split = aMpMString.split(" ");
  const hour = split[0];
  const amPm = split[1];
  return `${hour}:30 ${amPm}`;
}
function convertHourToAmPm(hour: number, isHalfHour: boolean) {
  if (hour === 0) {
    return `12${isHalfHour ? ":30" : ""} AM`;
  } else if (hour < 12) {
    return `${hour}${isHalfHour ? ":30" : ""} AM`;
  } else if (hour === 12) {
    return `12${isHalfHour ? ":30" : ""} PM`;
  } else {
    return `${hour - 12}${isHalfHour ? ":30" : ""} PM`;
  }
}

//function to return  an array with day numbers concatenated with am and pm string
export function getHoursOfTheDay() {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    if (i < 12) {
      if (i === 0) {
        hours.push("");
      } else {
        hours.push(`${i} AM`);
      }
    } else if (i === 12) {
      hours.push(`${i} PM`);
    } else {
      hours.push(`${i - 12} PM`);
    }
  }
  return hours;
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

// get users GMT offset
export function getGMTOffset() {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  const sign = offset > 0 ? "-" : "+";
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function getFirstAndDateOfWeekForAGivenDate(date: Date) {
  const weekDatesAndNamesArray = getWeekDatesAndNames(date);
  const firstDayOfWeek = weekDatesAndNamesArray[0].weekDay;
  const monthOfFirstDayOfWeek = weekDatesAndNamesArray[0].month;
  const lastDayOfWeek = weekDatesAndNamesArray[6].weekDay;
  const monthOfLastDayOfWeek = weekDatesAndNamesArray[6].month;
  const firstDateOfWeekDate = new Date(
    getYear(date),
    monthOfFirstDayOfWeek - 1,
    firstDayOfWeek,
  );
  const lastDateOfWeekDate = new Date(
    getYear(date),
    monthOfLastDayOfWeek - 1,
    lastDayOfWeek,
  );
  return {
    firstDateOfWeekDate,
    lastDateOfWeekDate,
  };
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
