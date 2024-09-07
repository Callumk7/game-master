import { SDK } from "@repo/api";
import { SERVER_URL } from "~/config";

export const api = new SDK({ baseUrl: SERVER_URL, apiKey: "temp_key" });
