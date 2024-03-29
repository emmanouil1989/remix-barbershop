import { authenticator } from "~/services/auth.server";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import React from "react";
import { Form, Link } from "@remix-run/react";
import Button from "~/components/button/Button";

export async function loader({ request }: LoaderFunctionArgs) {
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
      <Link to="/store/services">Services</Link>
      <Form method="post">
        <Button type="submit">Log Out</Button>
      </Form>
    </>
  );
}
