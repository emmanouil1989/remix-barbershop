import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/node";
import { prisma } from "~/db.server";
import invariant from "tiny-invariant";
import { json } from "@remix-run/node";
import type { StoreServices } from "@prisma/client";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import React from "react";

export async function loader() {
  const store = await prisma.store.findFirst();
  invariant(store, "No store found");
  const storeServices = await prisma.storeServices.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      storeId: store.id,
    },
  });
  invariant(storeServices, "No store services found");
  return json({ storeServices });
}

export default function AdminServices() {
  const { storeServices } = useLoaderData<typeof loader>();
  return (
    <section className="flex flex-col h-full xl:w-[1200px] overflow-hidden">
      <div className="pt-4 flex justify-end">
        <Link to="/store/services/new" className="button">
          Create Service
        </Link>
      </div>

      <div className="flex w-full h-full flex-row items-center ">
        <ul className="w-full flex flex-col h-5/6 gap-4 p-4 overflow-y-auto overflow-x-hidden">
          {storeServices.map(service => {
            return <ServiceListItem key={service.id} service={service} />;
          })}
        </ul>
        <Outlet />
      </div>
    </section>
  );
}

function ServiceListItem({
  service,
}: {
  service: SerializeFrom<StoreServices>;
}) {
  const urlParamsRecord = useParams();
  const urlServiceId = urlParamsRecord["id"];
  const isDisabled = !service.enabled;
  const isSelected = service.id === urlServiceId;
  return (
    <Link to={`/store/services/${service.id}`} key={service.id}>
      <li
        className={`${isDisabled ? "opacity-40 cursor-not-allowed" : ""} p-4 ${
          isSelected ? "border-4" : "border"
        } border-solid border-gray-600 flex flex-row justify-between`}
      >
        <ListItemContainer className=" w-full">
          <span>{service.name}</span>{" "}
        </ListItemContainer>
        <ListItemContainer className="justify-end pr-4">
          <span>{`${service.price} `}&euro;</span>
        </ListItemContainer>
      </li>
    </Link>
  );
}

export const ListItemContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const classes = twMerge(`
flex flex-row justify-between items-center w-full
    ${className ?? ""}
  `);
  return <div className={classes}>{children}</div>;
};
