// app/routes/test-email.tsx
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { emailService } from "~/services/email.server";

export const action: ActionFunction = async () => {
  const result = await emailService.sendEmail({
    to: "test@example.com",
    subject: "Test Email",
    html: "<h1>Test Email</h1><p>This is a test email from MailHog</p>",
  });

  return json(result);
};

export default function TestEmail() {
  return (
    <Form method="post">
      <button type="submit">Send Test Email</button>
    </Form>
  );
}
