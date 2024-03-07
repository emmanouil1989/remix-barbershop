import React from "react";
import type { ScheduleBodyProps } from "../Scheduler";
import { ScheduleBody, ScheduleHeader } from "../Scheduler";

export default function WeekView({
  bookingsWithDaysAndHours,
  weekDatesAndNamesArray,
  dayParam,
  monthParam,
  yearParam,
  timeView,
}: ScheduleBodyProps) {
  return (
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-20rem)]">
      <ScheduleHeader
        dayParam={dayParam}
        weekDatesAndNamesArray={weekDatesAndNamesArray}
      />
      <ScheduleBody
        monthParam={monthParam}
        timeView={timeView}
        yearParam={yearParam}
        dayParam={dayParam}
        weekDatesAndNamesArray={weekDatesAndNamesArray}
        bookingsWithDaysAndHours={bookingsWithDaysAndHours}
      />
    </div>
  );
}
