import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const form = await request.formData();
};

export default function LoginRoute() {
  return (
    <div className="my-10 w-4/5 mx-auto space-y-4">
      <h1>Sign In</h1>
      <form method="post" className="flex flex-col gap-y-1">
        <label htmlFor="email">email</label>
        <input className="border p-1" name="email" id="email" />
        <br />
        <label htmlFor="password">Password</label>
        <input className="border p-1" type="password" name="password" id="password" />
        <br />
        <button className="bg-sky-200 p-2" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}
