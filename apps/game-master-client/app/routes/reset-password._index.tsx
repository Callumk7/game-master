import { type ActionFunctionArgs, json } from "react-router";
import { Form } from "react-router";
import { db } from "db";
import { users } from "db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { parseForm } from "zodix";
import { Button } from "~/components/ui/button";
import { JollyTextField } from "~/components/ui/textfield";
import { emailService } from "~/services/email.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { email } = await parseForm(request, { email: z.string() });

  const resetToken = crypto.randomUUID();
  const resetTokenExpiry = new Date(Date.now() + 3600000);

  await db
    .update(users)
    .set({ resetToken, resetTokenExpiry })
    .where(eq(users.email, email));

  await emailService.sendResetEmail(email, resetToken);

  return json({ success: true });
};

export default function ResetPassword() {
  return (
    <Form method="POST">
      <JollyTextField type="email" name="email" isRequired />
      <Button type="submit">Reset Password</Button>
    </Form>
  );
}
