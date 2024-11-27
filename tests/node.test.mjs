import * as assert from "node:assert";
import { test } from "node:test";
import { verify } from "apple-app-site-association";

const json = await fetch(
	"https://zozo.jp/.well-known/apple-app-site-association",
).then((res) => res.json());

test("/sale/ should match", async () => {
	assert.strictEqual(await verify("zozo.jp", "/sale/", json), "match");
});

test("#nondeeplinking should block", async () => {
	assert.strictEqual(
		await verify("zozo.jp", "/sale/#nondeeplinking", json),
		"block",
	);
});
