import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { baseUserSchema } from "@repo/api";
import { db } from "db";
import { users } from "db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { parseForm } from "zodix";
import { BaseUserForm } from "~/components/forms/user-forms";
import { Layout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { JollyTextField } from "~/components/ui/textfield";
import { Text } from "~/components/ui/typeography";
import { createApiFromReq } from "~/lib/api.server";
import { hashPassword } from "~/services/password-hash.server";
import { useAppData } from "../_app/route";

const updatePasswordSchema = z.object({
  intent: z.literal("updatePassword"),
  currentPass: z.string(),
  newPass: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const { api, userId } = await createApiFromReq(request);
  if (request.method === "PATCH") {
    const data = await parseForm(
      request,
      z.discriminatedUnion("intent", [
        updatePasswordSchema,
        baseUserSchema.extend({ intent: z.literal("updateUser") }),
      ]),
    );

    if (data.intent === "updateUser") {
      const result = await api.users.update(userId, data);
      return result;
    }

    if (data.intent === "updatePassword") {
      const passwordHash = await hashPassword(data.newPass);
      await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
      return { success: true };
    }
  }
};

export default function UserRoute() {
  const { userData } = useAppData();
  return (
    <Layout spacing={"wide"}>
      <Link href="/games" variant={"secondary"}>
        Back to Games
      </Link>
      <Text variant={"h1"}>Settings</Text>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <BaseUserForm method="PATCH" buttonLabel="Update" user={userData}>
            <input type="hidden" name="intent" value={"updateUser"} />
          </BaseUserForm>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="PATCH">
            <div className="space-y-2 p-6">
              <JollyTextField
                label="Current password"
                type="password"
                name="currentPass"
              />
              <JollyTextField label="New password" type="password" name="newPass" />
              <input type="hidden" name="intent" value={"updatePassword"} />
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}
