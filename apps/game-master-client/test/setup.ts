import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";
import { afterAll, afterEach, beforeAll } from "vitest";

const server = setupServer(...handlers);

beforeAll(() => server.listen({onUnhandledRequest: "error"}));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
