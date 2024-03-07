import React from "react";
import Button from "~/components/button/Button";
import Calendar from "~/components/Calendar/Calendar";
import {
  getFirstAndLastDateOfMonthForAGivenDate,
  getFirstAndDateOfWeekForAGivenDate as getFirstAndLastDateOfWeekForAGivenDate,
  getHourFromDate,
  getMonthNumber,
} from "~/utils/calendarUtils";
import type { HourBooking } from "~/components/ Scheduler/Scheduler";
import Scheduler from "~/components/ Scheduler/Scheduler";
import { prisma } from "~/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Booking } from "@prisma/client";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { getDate } from "date-fns";
import type { Key } from "react-aria-components";
import Select from "~/components/Select";
import { useSendNotification } from "~/utils/notification";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const year = url.searchParams.get("year");
  const month = url.searchParams.get("month");
  const day = url.searchParams.get("day");
  const tableView = url.searchParams.get("tableView");
  const error = url.searchParams.get("error");
  let date = new Date();
  if (year && month && day) {
    const calculatedMonth = Number(month) - 1;
    date = new Date(Number(year), calculatedMonth, Number(day));
  }
  let bookings: Array<Booking> = [];
  let startDate;
  let endDate;
  if (tableView === "Week") {
    const { firstDateOfWeekDate, lastDateOfWeekDate } =
      getFirstAndLastDateOfWeekForAGivenDate(date);
    startDate = firstDateOfWeekDate;
    endDate = lastDateOfWeekDate;
  } else {
    const { firstDayOfMonth, lastDayOfMonth } =
      getFirstAndLastDateOfMonthForAGivenDate(date);
    startDate = firstDayOfMonth;
    endDate = lastDayOfMonth;
  }

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
            gte: startDate,
            lte: endDate,
          },
        },
      },
    });
  }

  const bookingsWithDaysAndHours = bookings.reduce<
    Record<string, Record<string, HourBooking>>
  >((bookingRecord, booking) => {
    const day = getDate(booking.start);
    const month = getMonthNumber(booking.start);
    const hour = getHourFromDate(booking.start);
    if (bookingRecord[month]) {
      if (bookingRecord[month][day]) {
        return {
          ...bookingRecord,
          [month]: {
            ...bookingRecord[month],
            [day]: {
              ...bookingRecord[month][day],
              [hour]: booking,
            },
          },
        };
      } else {
        return {
          ...bookingRecord,
          [month]: {
            ...bookingRecord[month],
            [day]: {
              [hour]: booking,
            },
          },
        };
      }
    } else {
      return {
        ...bookingRecord,
        [month]: {
          [day]: {
            [hour]: booking,
          },
        },
      };
    }
  }, {});

  return json({
    bookingsWithDaysAndHours,
    error,
    dateString: date,
    timeView: tableView,
    dayParam: day || getDate(date).toString(),
    monthParam: month || getMonthNumber(date).toString(),
    yearParam: year || date.getFullYear().toString(),
  });
}

export default function AdminStoreBookings() {
  const {
    bookingsWithDaysAndHours,
    error,
    dateString,
    timeView,
    monthParam,
    yearParam,
    dayParam,
  } = useLoaderData<typeof loader>();
  useSendNotification("Error", error);
  const date = new Date(dateString);

  return (
    <div className="flex h-full w-full flex-col py-4 gap-4">
      <AppointmentScheduleHeader />

      <div className="grid grid-cols-[max-content_1fr] gap-4 p-4">
        <Calendar
          date={date}
          timeView={isTypeViewType(timeView) ? timeView : "Week"}
        />
        <Scheduler
          bookingsWithDaysAndHours={bookingsWithDaysAndHours}
          dayParam={dayParam}
          monthParam={monthParam}
          yearParam={yearParam}
          timeView={isTypeViewType(timeView) ? timeView : "Week"}
        />
      </div>
      <Outlet />
    </div>
  );
}

function AppointmentScheduleHeader() {
  const selectOptions = useSelectOptions();
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const tableView = searchParams.get("tableView");
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-row xl:w-[1200px] items-center justify-end gap-4 pb-4">
        <Select
          selectedValue={tableView || "Week"}
          onChange={(value: Key) => {
            if (isTypeViewType(value)) {
              searchParams.delete("tableView");
              const params =
                searchParams.size > 0 ? `&${searchParams.toString()}` : "";
              navigate(`/store/bookings?tableView=${value}${params}`);
            }
          }}
          items={selectOptions}
        />
        <Button
          onPress={() => {
            navigate(`/store/bookings/new?${searchParams.toString()}`);
          }}
        >
          Add Booking
        </Button>
      </div>
    </div>
  );
}

export type TimeViewsType = "Month" | "Week";
export const isTypeViewType = (value: unknown): value is TimeViewsType => {
  return value === "Month" || value === "Week";
};

const useSelectOptions = () => {
  return [
    { value: "Month", textValue: "Month View" },
    { value: "Week", textValue: "Week View" },
  ];
};
