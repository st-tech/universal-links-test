import type { JsonOrPath } from "../types.js";

export function resolveJson(
	json: JsonOrPath,
): Promise<Record<string, unknown>> {
	if (typeof json !== "string") return Promise.resolve(json);
	const trimmed = json.trim();
	return trimmed.startsWith("{") && trimmed.endsWith("}")
		? new Promise((r) => r(JSON.parse(trimmed)))
		: resolveJsonPath(trimmed);
}

async function resolveJsonPath(path: string): Promise<Record<string, unknown>> {
	// Dyanmic import to make it portable for other environments
	const [{ readFile }, { cwd }, { join }] = await Promise.all([
		import("node:fs/promises"),
		import("node:process"),
		import("node:path"),
	]);
	return JSON.parse(await readFile(join(cwd(), path), { encoding: "utf8" }));
}
