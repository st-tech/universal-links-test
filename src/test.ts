import type { JsonOrPath, PromiseOr, VerifyResult } from "./types.js";
import { createVerifier } from "./verify.js";
import { strictEqual } from "node:assert";

type Assert = {
	universalLink(path: string, expected: VerifyResult): Promise<void>;
	universalLinks(map: Iterable<[string, VerifyResult]>): Promise<void>;
};
export function createAssert(
	domain: string,
	json: PromiseOr<JsonOrPath>,
): Assert {
	const verify = createVerifier(domain, json);
	const assertSingle: Assert["universalLink"] = async (path, expected) => {
		const res = await verify(path);
		strictEqual(res, expected, `Expected ${expected}, got ${res}. (${path})`);
	};
	return {
		universalLink: assertSingle,
		async universalLinks(map) {
			for (const [path, expected] of map) {
				await assertSingle(path, expected);
			}
		},
	};
}
