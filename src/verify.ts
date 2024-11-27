import { swcutil } from "./swcutil.js";
import type { JsonOrPath, PromiseOr, VerifyResult } from "./types.js";

/**
 * String literal types with auto-completion
 * @see https://github.com/Microsoft/TypeScript/issues/29729
 */
export type StringLiteralUnion<T> = T | (string & Record<never, never>);
type AASAUrl = StringLiteralUnion<
	| `https://app-site-association.cdn-apple.com/a/v1/${string}`
	| `https://${string}/.well-known/apple-app-site-association`
>;

export function createVerifier(
	domain: string,
	/** path / object / url(download it if specified) */
	json?: PromiseOr<JsonOrPath | AASAUrl>,
): (path: string) => Promise<VerifyResult> {
	const aasaPromise = resolveAASA(domain, json);
	return async (path: string) => await verify(domain, path, await aasaPromise);
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

function resolveAASA(
	domain: string,
	/** path / object / url(download it if specified) */
	json?: PromiseOr<JsonOrPath | AASAUrl>,
): PromiseOr<JsonOrPath> {
	if (json === undefined) {
		return fetch(
			`https://app-site-association.cdn-apple.com/a/v1/${domain}`,
		).then((res) => res.json());
	}
	if (typeof json === "string" && json.startsWith("https://")) {
		return fetch(json).then((res) => res.json());
	}
	return json;
}
function url(domain: string, path: string): string {
	return new URL(path, `https://${domain}`).href;
}
