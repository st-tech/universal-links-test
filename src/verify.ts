import { swcutil } from "./swcutil.js";
import type { CreateVerify, Verify } from "./types.js";

export const createVerify: CreateVerify = (json) => async (path) => {
	const res = await swcutil({
		command: "verify",
		json,
		url: path,
	});
	if (res.status !== 0) throw new Error(res.stderr);
	/**
	 * @example
	 * ```
	 * { s = applinks, a = HOGE.com.example.app, d = www.example.com }: Pattern "/" matched.
	 * { s = applinks, a = FUGA.com.example.app, d = www.example.com }: Pattern "/" matched.
	 * { s = applinks, a = FOO.com.example.app, d = www.example.com }: Pattern "/" blocked match.
	 * { s = applinks, a = BAR.com.example.app, d = www.example.com }: Pattern "/" blocked match.
	 * ```
	 */
	const out = res.stdout.trimEnd();
	const lines = out.split("\n");
	const resultMap = lines
		.map((line) => {
			const appID = line.match(/a = ([^,]+),/)?.[1];
			if (!appID) return undefined;
			return [appID, line.endsWith("matched.") ? "match" : "block"] as const;
		})
		.filter((x) => x !== undefined);
	return new Map(resultMap);
};

/**
 * Verify the URL with the apple-app-site-association file.
 * This function is a wrapper of the `swcutil` command.
 * So you need to run on macOS and root permission is required.
 * @param json apple-app-site-association file content or path
 * @param path URL to verify
 * @returns Map of appID and match/block
 */
export const verify: Verify = (json, path) => createVerify(json)(path);
