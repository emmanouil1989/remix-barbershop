import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { DropdownOption } from "~/components/Dropdown/Dropdown";
import Dropdown from "~/components/Dropdown/Dropdown";
import Button from "~/components/button/Button";
import Calendar from "~/components/Calendar/Calendar";

type TimeViewsType = "Month" | "Week";

export default function AdminStoreBookings() {
  const timeViewState = useState<TimeViewsType>("Month");
  return (
    <div className={"flex h-full w-full flex-col py-8 gap-4"}>
      <AppointmentScheduleHeader timeViewState={timeViewState} />
      <Calendar />
    </div>
  );
}

const useDropdownOptions = (): Array<DropdownOption> => {
  return [
    { value: "Month", label: "Month View" },
    { value: "Week", label: "Week View" },
  ];
};

//function to use date-fns to get current month

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
    <div
      className={
        "flex flex-row items-center justify-end gap-4 border border-solid border-gray-600 p-4"
      }
    >
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
