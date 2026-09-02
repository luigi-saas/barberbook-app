import { database } from "@repo/database";

export const GET = async () => {
  await database.user.findFirst({ select: { id: true } });

  return new Response("OK", { status: 200 });
};
