import { swcutil } from "./swcutil.js";
import type { JsonOrPath, PromiseOr, VerifyResult } from "./types.js";

export function createVerifier(
	domain: string,
	/** path or object, if not provided, download from the specified domain */
	json?: PromiseOr<JsonOrPath>,
): (path: string) => Promise<VerifyResult> {
	const _json =
		json ||
		fetch(url(domain, "/.well-known/apple-app-site-association")).then((res) =>
			res.text(),
		);
	return async (path: string) => await verify(domain, path, await _json);
}

export async function verify(
	domain: string,
	path: string,
	json: JsonOrPath,
): Promise<VerifyResult> {
	const res = await swcutil({
		command: "verify",
		domain,
		json,
		url: url(domain, path),
	});
	const out = res.stdout.trimEnd();
	if (out.endsWith("matched.")) return "match";
	if (out.endsWith("blocked match.")) return "block";
	return "unset";
}

function url(domain: string, path: string): string {
	return new URL(path, `https://${domain}`).href;
}
