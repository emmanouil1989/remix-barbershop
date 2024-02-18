import type { User } from "@prisma/client";
import { json, type LoaderArgs, type LoaderFunction } from "@remix-run/node";

import { prisma } from "~/db.server";

export type UserListData = {
  users: User[];
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  let url = new URL(request.url);
  let term = url.searchParams.get("term");
  if (!term) {
    const fiveUsers = await prisma.user.findMany({
      take: 5,
    });
    return json({ users: fiveUsers });
  }
  const users = await prisma.user.findMany({
    where: {
      firstName: {
        contains: term,
      },
    },
  });

  return json({ users });
};
