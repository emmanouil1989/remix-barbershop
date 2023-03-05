import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import type { DropdownOption } from "~/components/Dropdown/Dropdown";
import Dropdown from "~/components/Dropdown/Dropdown";
import Button from "~/components/button/Button";
import Calendar from "~/components/Calendar/Calendar";
import {
  CalendarContextProvider,
  getFirstAndDateOfWeekForAGivenDate,
} from "~/utils/calendarUtils";
import Scheduler from "~/components/ Scheduler/Scheduler";
import { prisma } from "~/db.server";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Booking } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";

type TimeViewsType = "Month" | "Week";

export async function loader({ params }: LoaderArgs) {
  const year = params.year;
  const month = params.month;
  const day = params.day;
  let date = new Date();
  if (
    typeof year === "string" &&
    typeof month === "string" &&
    typeof day === "string"
  ) {
    const calculatedMonth = Number(month) - 1;
    date = new Date(Number(year), calculatedMonth, Number(day));
  }
  const { firstDayOfWeek, lastDayOfWeek } =
    getFirstAndDateOfWeekForAGivenDate(date);

  console.log({ firstDayOfWeek, lastDayOfWeek });
  let bookings: Array<Booking> = [];
  const store = await prisma.store.findFirst();
  if (store) {
    bookings = await prisma.booking.findMany({
      where: {
        storeId: store.id,
        AND: {
          start: {
            gte: firstDayOfWeek,
            lte: lastDayOfWeek,
          },
        },
      },
    });
  }

  return json({ bookings });
}

export default function AdminStoreBookings() {
  const timeViewState = useState<TimeViewsType>("Month");
  const loaderData = useLoaderData<typeof loader>();
  console.log({ loaderData });
  return (
    <div className={"flex h-full w-full flex-col py-4 gap-4"}>
      <AppointmentScheduleHeader timeViewState={timeViewState} />

      <CalendarContextProvider>
        <div className={"grid grid-cols-[max-content_1fr] gap-4"}>
          <Calendar />
          <Scheduler />
        </div>
      </CalendarContextProvider>
    </div>
  );
}

const useDropdownOptions = (): Array<DropdownOption> => {
  return [
    { value: "Month", label: "Month View" },
    { value: "Week", label: "Week View" },
  ];
};

type AppointmentScheduleHeaderProps = {
  timeViewState: [TimeViewsType, Dispatch<SetStateAction<TimeViewsType>>];
};
const isTypeViewType = (value: unknown): value is TimeViewsType => {
  return value === "Month" || value === "Week";
};
function AppointmentScheduleHeader({
  timeViewState,
}: AppointmentScheduleHeaderProps) {
  const options = useDropdownOptions();
  const [timeView, setTimeView] = timeViewState;
  return (
    <div className={"flex flex-row items-center justify-end gap-4 pb-4"}>
      <Dropdown
        selectedValue={timeView}
        onChange={(value: string) => {
          if (isTypeViewType(value)) {
            setTimeView(value);
          }
        }}
        options={options}
      />
      <Button>Add Booking</Button>
    </div>
  );
}
