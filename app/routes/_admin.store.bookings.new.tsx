import React, { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Dialog, { DialogFooter, DialogHeader } from "~/components/Dialog";
import Button from "~/components/button/Button";
import DatePicker from "~/components/DatePicker";
import { withZod } from "@remix-validated-form/with-zod";
import zod from "zod";
import { ValidatedForm } from "remix-validated-form";
import { prisma } from "~/db.server";
import { json } from "@remix-run/node";
import { ComboBox, ComboboxItem } from "~/components/Combobox/Combobox";
import Select from "~/components/Select";
import TimeField from "~/components/TimeField";

export async function loader() {
  const allServicesPromise = prisma.storeServices.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const allUsersPromise = prisma.user.findMany({});
  const [allServices, allUsers] = await Promise.all([
    allServicesPromise,
    allUsersPromise,
  ]);

  return json({ services: allServices, users: allUsers });
}

const validator = withZod(
  zod.object({
    name: zod.string().min(1, { message: "Name is required" }),
    price: zod
      .string()
      .min(1, { message: "Price is required" })
      .max(11, { message: "Price is too long" })
      .regex(/^[0-9]*(\.[0-9]{0,2})?$/, {
        message: "Price must be in the format of 0.00",
      }),
  }),
);

export default function NewBooking() {
  const navigate = useNavigate();
  let [isOpen, setIsOpen] = useState(true);

  const { services, users } = useLoaderData<typeof loader>();

  const peopleList = users.map(user => ({
    value: user.id,
    textValue: `${user.firstName} ${user.lastName}`,
  }));

  const handleClose = () => {
    setIsOpen(false);
    navigate(-1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen}>
      <DialogHeader title="New Booking" />
      <ValidatedForm
        validator={validator}
        method="post"
        className="flex flex-col gap-4 w-full h-full"
      >
        <div>
          <ComboBox
            label="First Name"
            name="fistName"
            defaultItems={peopleList}
          >
            {item => (
              <ComboboxItem id={item.value}>{item.textValue}</ComboboxItem>
            )}
          </ComboBox>
          <DatePicker label="Date" name="date" />
          <TimeField label="Time" name="time" />
          <Select
            className="w-full"
            name="services"
            label="Service"
            items={services.map(service => ({
              value: service.id,
              textValue: service.name,
            }))}
          />
        </div>
        <DialogFooter>
          <Button onPress={handleClose}>Cancel</Button>
        </DialogFooter>
      </ValidatedForm>
    </Dialog>
  );
}
