import React, { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import zod from "zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import Toggle from "~/components/toggle/Toggle";
import Button from "~/components/button/Button";
import Dialog, { DialogFooter, DialogHeader } from "~/components/Dialog";
import Input from "~/components/Form/Input";

const Validator = withZod(
  zod.object({
    name: zod.string().trim().min(1, { message: "Name is required" }),
    price: zod
      .string()
      .trim()
      .min(1, { message: "Price is required" })
      .max(11, { message: "Price is too long" })
      .regex(/^[0-9]*(\.[0-9]{0,2})?$/, {
        message: "Price must be in the format of 0.00",
      }),

    enabled: zod.string().trim(),
  }),
);

export async function action({ request, params }: ActionFunctionArgs) {
  const serviceId = params.id;
  invariant(serviceId, "Service ID is required");
  const formData = await request.formData();
  const isDelete = formData.get("intent");
  if (isDelete === "delete") {
    await prisma.storeServices.delete({
      where: {
        id: serviceId,
      },
    });
    return redirect("/store/services");
  }
  const fieldValues = await Validator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);
  const { name, price, enabled } = fieldValues.data;
  await prisma.storeServices.update({
    where: { id: serviceId },
    data: {
      name,
      price: Number(price),
      enabled: enabled === "true",
    },
  });
  return redirect(`/store/services/${serviceId}`);
}

export async function loader({ params }: LoaderFunctionArgs) {
  const serviceId = params.id;
  invariant(serviceId, "serviceId is required");
  const service = await prisma.storeServices.findUnique({
    where: {
      id: serviceId,
    },
  });
  invariant(service, "No service found");
  return json({ service });
}

export default function ViewServicePage() {
  const { service } = useLoaderData<typeof loader>();
  const [isOpen, setIsOpen] = React.useState(false);
  const transition = useNavigation();
  const isUpdating = transition.formData?.get("intent") === "update";
  const isDeleting = transition.formData?.get("intent") === "delete";
  useEffect(() => {
    if (isDeleting) {
      setIsOpen(false);
    }
  }, [isDeleting]);

  return (
    <section className="flex flex-col w-full h-full pt-4 items-center pl-8">
      <h1>{service.name}</h1>
      <ValidatedForm
        key={service.id}
        validator={Validator}
        method="post"
        className="flex flex-col gap-4 w-full h-full"
        defaultValues={{
          name: service.name,
          price: service.price.toString(),
          enabled: service.enabled.toString(),
        }}
      >
        <div className="flex flex-col ">
          <Input name="name" label="Service Name:" type="text" />
        </div>
        <div className="flex flex-col ">
          <Input name="price" label="Price:" type="number" step="any" />
        </div>
        <div key={service.id} className="flex  gap-4">
          <label htmlFor="enabled">Enabled:</label>
          <Toggle name="enabled" initialValue={service.enabled} />
        </div>
        <div className="flex flex-row gap-4">
          <Button type="submit" className="button" name="intent" value="update">
            {isUpdating ? "Updating your service..." : "Update Service"}
          </Button>
          <Dialog
            role="alertdialog"
            open={isOpen}
            onOpenChange={() => setIsOpen(!isOpen)}
            triggerButton={
              <Button
                value="delete"
                onPress={() => setIsOpen(!isOpen)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Service
              </Button>
            }
          >
            <DialogHeader
              title="Delete Service"
              description="Are you sure you want to delete this service?"
            />
            <DialogFooter>
              <Form method="post">
                <div className="flex justify-end gap-4 mt-4">
                  <Button
                    type="submit"
                    name="intent"
                    value="delete"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes
                  </Button>
                  <Button
                    onPress={() => {
                      setIsOpen(false);
                    }}
                  >
                    No
                  </Button>
                </div>
              </Form>
            </DialogFooter>
          </Dialog>
        </div>
      </ValidatedForm>
    </section>
  );
}
