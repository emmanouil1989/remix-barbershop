import React, { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import Dialog, { DialogFooter, DialogHeader } from "~/components/Dialog";
import Button from "~/components/button/Button";
import DatePicker from "~/components/DatePicker";
import { withZod } from "@remix-validated-form/with-zod";
import zod from "zod";
import { ValidatedForm } from "remix-validated-form";
import { prisma } from "~/db.server";
import { json } from "@remix-run/node";
import { ComboBox, ComboboxItem } from "~/components/Combobox/Combobox";
import type { UserListData } from "./_admin.api.people.search";
import Select from "~/components/Select";

export async function loader() {
  const allServices = await prisma.storeServices.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  return json({ services: allServices });
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

  const { services } = useLoaderData<typeof loader>();
  const [peopleQuery, setPeopleQuery] = useState("");
  const { data, load } = useFetcher<UserListData>();
  const people = data?.users ?? [];
  useEffect(
    function getFilteredPeople() {
      load(`/api/people/search?term=${peopleQuery}`);
    },
    [load, peopleQuery],
  );

  const handleClose = () => {
    setIsOpen(false);
    navigate(-1);
  };
  const peopleList = people.map(person => ({
    value: person.id,
    textValue: person.firstName,
  }));

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
            items={peopleList}
            inputValue={peopleQuery}
            onInputChange={setPeopleQuery}
          >
            {item => (
              <ComboboxItem key={item.value} id={item.value}>
                {item.textValue}
              </ComboboxItem>
            )}
          </ComboBox>
          <DatePicker label="Date" name="date" />
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
