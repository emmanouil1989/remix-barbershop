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
    const tenUsers = await prisma.user.findMany({
      take: 10,
    });
    return json({ users: tenUsers });
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
