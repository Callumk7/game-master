import type { ActionFunction } from "react-router";
import { json } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";
import { env } from "~/lib/env.server";
import { emailService } from "~/services/email.server";

export const loader = async () => {
  const isConnected = await emailService.verifyConnection();
  const service = env.USE_SES_IN_DEV === "true" ? "AWS SES" : "MailHog";

  return json({
    isConnected,
    service,
    isDevelopment: env.isDevelopment,
  });
};

export const action: ActionFunction = async () => {
  const result = await emailService.sendEmail({
    to: "callumkloos@gmail.com",
    subject: "Test Email",
    html: "<h1>Test Email</h1><p>This is a test email from MailHog</p>",
  });

  return json(result);
};

export default function TestEmail() {
  const { isConnected, service, isDevelopment } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <div className="p-6 mx-auto space-y-4 w-10/12">
      <h1 className="text-xl font-bold text-blue-400">Email testing</h1>
      <div className="p-3 space-y-2 border border-sky-400">
        <h2>Service Status</h2>
        <p>Environment: {isDevelopment ? "Development" : "Production"}</p>
        <p>Service: {service}</p>
        <p>Connection: {isConnected ? "✅ CONNECTED" : "❌ NO CONNECTION"}</p>
      </div>

      <Form method="post">
        <button type="submit">Send Test Email</button>
      </Form>

      {actionData?.success && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <p>Email sent successfully!</p>
          <p>Message ID: {actionData.messageId}</p>
          {isDevelopment && service === "MailHog" && (
            <p>
              View email at:{" "}
              <a href="http://localhost:8025" target="_blank" rel="noopener noreferrer">
                MailHog Interface
              </a>
            </p>
          )}
        </div>
      )}

      {actionData?.error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <p>Error sending email:</p>
          <pre>{JSON.stringify(actionData.error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
