import React, { useState } from "react";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import Dialog, { DialogFooter, DialogHeader } from "~/components/Dialog";
import Button from "~/components/button/Button";
import DatePicker from "~/components/DatePicker";
import { withZod } from "@remix-validated-form/with-zod";
import zod from "zod";
import { validationError } from "remix-validated-form";
import { prisma } from "~/db.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ComboBox, ComboboxItem } from "~/components/Combobox/Combobox";
import Select from "~/components/Select";
import TimeField from "~/components/TimeField";
import type { Key } from "react-aria-components";
import { Form } from "react-aria-components";
import Input from "~/components/Form/Input";
import { addMinutes } from "date-fns";

export async function loader() {
  const allServicesPromise = prisma.storeServices.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const allUsersPromise = prisma.user.findMany({
    where: {
      role: "USER",
    },
  });
  const [allServices, allUsers] = await Promise.all([
    allServicesPromise,
    allUsersPromise,
  ]);

  return json({ services: allServices, users: allUsers });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const { firstName, date, time, service } = fieldValues.data;
  console.log({ firstName, date, time, service });
  const store = await prisma.store.findFirst({});
  if (!store) redirect("/store/bookings?error=store-not-found");

  await prisma.booking.create({
    data: {
      start: new Date(`${date}T${time}`),
      end: addMinutes(new Date(`${date}T${time}`), 30),
      user: {
        connect: {
          id: firstName,
        },
      },
      services: {
        create: {
          storeService: {
            connect: {
              id: service,
            },
          },
        },
      },
      store: {
        connect: {
          id: store.id,
        },
      },
    },
  });

  return redirect("/store/bookings");
}
const validator = withZod(
  zod.object({
    firstName: zod.string().min(1, { message: "Name is required" }),
    date: zod.string().min(1, { message: "Date is required" }),
    time: zod.string().min(1, { message: "Time is required" }),
    service: zod.string().min(1, { message: "Service is required" }),
  }),
);

export default function NewBooking() {
  const navigate = useNavigate();
  const { services, users } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  const [isOpen, setIsOpen] = useState(true);
  const [selectedValue, setSelectedValue] = useState<Key | undefined>(
    undefined,
  );

  const price = services.find(service => service.id === selectedValue)?.price;

  const submit = useSubmit();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(e.currentTarget);
  };

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
      <Form
        onSubmit={onSubmit}
        method="post"
        validationErrors={data?.fieldErrors}
        className="flex flex-col gap-4 w-full h-full p-2 "
      >
        <DialogHeader title="New Booking" />

        <ComboBox
          label="First Name:"
          name="firstName"
          defaultItems={peopleList}
          className="flex flex-col gap-1 outline-none w-full"
          isRequired
          errorMessage="Name is required"
        >
          {item => (
            <ComboboxItem id={item.value}>{item.textValue}</ComboboxItem>
          )}
        </ComboBox>
        <div className="flex flex-row gap-4 w-full h-full justify-center">
          <DatePicker
            label="Date:"
            name="date"
            isRequired
            errorMessage="Data is required"
          />
          <TimeField
            label="Time:"
            name="time"
            isRequired
            errorMessage="Time is required"
          />
        </div>

        <Select
          className="w-full flex flex-col gap-1"
          name="service"
          label="Service:"
          isRequired
          errorMessage="Service is required"
          items={services.map(service => ({
            value: service.id,
            textValue: service.name,
          }))}
          selectedValue={selectedValue}
          onChange={value => setSelectedValue(value)}
        />
        {selectedValue && (
          <div className="flex flex-col ">
            <Input
              name="price"
              label="Price:"
              type="text"
              value={`${price} €`}
              form="new-booking"
            />
          </div>
        )}
        <DialogFooter>
          <Button onPress={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </Form>
    </Dialog>
  );
}
