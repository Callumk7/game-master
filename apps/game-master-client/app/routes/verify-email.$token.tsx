import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { db } from "db";
import { users } from "db/schema/users";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";
import { parseParams } from "zodix";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { token } = parseParams(params, { token: z.string() });

  try {
    const user = await db.query.users.findFirst({
      where: and(
        eq(users.emailVerificationToken, token),
        gt(users.emailVerificationTokenExpiry, new Date()),
      ),
    });

    if (!user) {
      throw new Error("Invalid or expired verification link");
    }

    await db
      .update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      })
      .where(eq(users.id, user.id));

    return redirect("/");
  } catch (error) {
    return redirect("/check-email");
  }
};
