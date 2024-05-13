import { Params } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

export function extractParam<T extends string>(key: T, params: Params): string {
	const schema = { [key]: z.string() };

	const result = zx.parseParams(params, schema);

	return result[key];
}
