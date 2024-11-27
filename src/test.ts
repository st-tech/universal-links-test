import type { VerifyResult } from "./types.js";
import { createVerifier } from "./verify.js";
import { strictEqual } from "node:assert";

type Assert = {
	universalLink(path: string, expected: VerifyResult): Promise<void>;
	universalLinks(map: Iterable<[string, VerifyResult]>): Promise<void>;
};
export function createAssert(
	...args: Parameters<typeof createVerifier>
): Assert {
	const verify = createVerifier(...args);
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
