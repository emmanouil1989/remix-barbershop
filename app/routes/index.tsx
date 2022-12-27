import { authenticator } from "~/services/auth.server";
import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import React from "react";
import { Form } from "@remix-run/react";
import Button from "~/components/button/Button";
import { toast } from "react-toastify";

export async function loader({ request }: LoaderArgs) {
  const userId = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });
  return json({ userId });
}

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/auth/login" });
};

export default function Index() {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-green-500">
        Hello world!
      </h1>
      <Button onClick={() => toast.success("hoooray")}>asdfasdf</Button>
      <Form method="post">
        <Button>Log Out</Button>
      </Form>
    </>
  );
}
