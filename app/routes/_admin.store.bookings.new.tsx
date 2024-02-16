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

export async function loader() {
  const allStoreServices = await prisma.storeServices.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
  });
  return json({ services: allStoreServices });
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
  const handleClose = () => {
    setIsOpen(false);
    navigate(-1);
  };
  //TODO imporve form
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen}>
      <DialogHeader title="New Booking" />
      <ValidatedForm
        validator={validator}
        method="post"
        className="flex flex-col gap-4 w-full h-full"
      >
        <div>
          <p>Content</p>
          <DatePicker label="Date" name="date" />
        </div>
        <DialogFooter>
          <Button onPress={handleClose}>Cancel</Button>
        </DialogFooter>
      </ValidatedForm>
    </Dialog>
  );
}
