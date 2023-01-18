import { addMonths, getDaysInMonth, getYear, getMonth } from "date-fns";

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
