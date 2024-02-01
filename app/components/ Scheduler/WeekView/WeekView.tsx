import React from "react";
import type { ScheduleBodyProps } from "../Scheduler";
import { ScheduleBody, ScheduleHeader } from "../Scheduler";

export default function WeekView({
  bookingsWithDaysAndHours,
  weekDatesAndNamesArray,
}: ScheduleBodyProps) {
  return (
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-20rem)]">
      <ScheduleHeader weekDatesAndNamesArray={weekDatesAndNamesArray} />
      <ScheduleBody
        weekDatesAndNamesArray={weekDatesAndNamesArray}
        bookingsWithDaysAndHours={bookingsWithDaysAndHours}
      />
    </div>
  );
}
