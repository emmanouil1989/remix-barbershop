import React from "react";
import type { DropdownOption } from "~/components/Dropdown/Dropdown";
import Dropdown from "~/components/Dropdown/Dropdown";
import Button from "~/components/button/Button";
import Calendar from "~/components/Calendar/Calendar";
import {
  CalendarContextProvider,
  getFirstAndDateOfWeekForAGivenDate,
  getHourFromDate,
  useCalendarContext,
} from "~/utils/calendarUtils";
import type { HourBooking } from "~/components/ Scheduler/Scheduler";
import Scheduler from "~/components/ Scheduler/Scheduler";
import { prisma } from "~/db.server";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Booking } from "@prisma/client";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getDate } from "date-fns";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const year = url.searchParams.get("year");
  const month = url.searchParams.get("month");
  const day = url.searchParams.get("day");
  let date = new Date();
  if (year && month && day) {
    const calculatedMonth = Number(month) - 1;
    date = new Date(Number(year), calculatedMonth, Number(day) + 1);
  }

  const { firstDayOfWeek, lastDayOfWeek } =
    getFirstAndDateOfWeekForAGivenDate(date);
  let bookings: Array<Booking> = [];
  const store = await prisma.store.findFirst();
  if (store) {
    bookings = await prisma.booking.findMany({
      include: {
        user: true,
        services: {
          include: {
            storeService: true,
          },
        },
      },
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

  const bookingsWithDaysAndHours = bookings.reduce<Record<string, HourBooking>>(
    (bookingRecord, booking) => {
      const day = getDate(booking.start);
      const hour = getHourFromDate(booking.start);
      if (bookingRecord[day]) {
        return {
          ...bookingRecord,
          [day]: {
            ...bookingRecord[day],
            [hour]: booking,
          },
        };
      } else {
        return {
          ...bookingRecord,
          [day]: {
            [hour]: booking,
          },
        };
      }
    },
    {},
  );

  return json({ bookingsWithDaysAndHours });
}

export default function AdminStoreBookings() {
  const { bookingsWithDaysAndHours } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full w-full flex-col py-4 gap-4">
      <CalendarContextProvider>
        <AppointmentScheduleHeader />

        <div className="grid grid-cols-[max-content_1fr] gap-4 p-4">
          <Calendar />
          <Scheduler bookingsWithDaysAndHours={bookingsWithDaysAndHours} />
        </div>
      </CalendarContextProvider>
    </div>
  );
}

function AppointmentScheduleHeader() {
  const options = useDropdownOptions();
  const navigate = useNavigate();
  const { timeView } = useCalendarContext();
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-row xl:w-[1200px] items-center justify-end gap-4 pb-4">
        <Dropdown
          selectedValue={timeView}
          onChange={(value: string) => {
            if (isTypeViewType(value)) {
              navigate(`/store/bookings?tableView=${value}`);
            }
          }}
          options={options}
        />
        <Button>Add Booking</Button>
      </div>
    </div>
  );
}

export type TimeViewsType = "Month" | "Week";
export const isTypeViewType = (value: unknown): value is TimeViewsType => {
  return value === "Month" || value === "Week";
};
const useDropdownOptions = (): Array<DropdownOption> => {
  return [
    { value: "Month", label: "Month View" },
    { value: "Week", label: "Week View" },
  ];
};
