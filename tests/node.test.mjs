import { test } from "node:test";
import { createAssert } from "apple-app-site-association";
const assert = createAssert("zozo.jp");

test("single", async () => {
	await assert.universalLink("/", "match");
});

test("multiple", async () => {
	await assert.universalLinks([
		["/", "match"],
		["/#nondeeplinking", "block"],
	]);
});
