import type { JsonOrPath } from "../types.js";

export function resolveJson(
	json: JsonOrPath,
): Promise<Record<string, unknown>> {
	return typeof json === "string"
		? resolveJsonPath(json)
		: Promise.resolve(json);
}

async function resolveJsonPath(path: string): Promise<Record<string, unknown>> {
	const { readFile } = await import("node:fs/promises");
	const { cwd } = await import("node:process");
	const { join } = await import("node:path");
	return JSON.parse(await readFile(join(cwd(), path), { encoding: "utf8" }));
}
