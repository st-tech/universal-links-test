import { swcutil } from "./swcutil.js";
import type { JsonOrPath, VerifyResult } from "./types.js";

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
	if (res.status !== 0) throw new Error(res.stderr);
	const out = res.stdout.trimEnd();
	if (out.endsWith("matched.")) return "match";
	if (out.endsWith("blocked match.")) return "block";
	return "unset";
}
function url(domain: string, path: string): string {
	return new URL(path, `https://${domain}`).href;
}
