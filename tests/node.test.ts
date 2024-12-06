import * as assert from "node:assert";
import { test } from "node:test";
import {
	type AppleAppSiteAssociation,
	verify,
} from "apple-app-site-association";
import { verify as verifySim } from "apple-app-site-association/sim";

const json = {
	applinks: {
		details: [
			{
				appIDs: ["HOGE.com.example.app"],
				components: [
					{ "#": "nondeeplinking", exclude: true },
					{ "/": "/search/" },
				],
			},
		],
	},
} as const satisfies AppleAppSiteAssociation;

test("/search/ should match", async () => {
	assert.strictEqual(await verify(json, "/search/"), "match");
	assert.strictEqual(await verifySim(json, "/search/"), "match");
});

test("#nondeeplinking should block", async () => {
	assert.strictEqual(await verify(json, "/search/#nondeeplinking"), "block");
	assert.strictEqual(await verifySim(json, "/search/#nondeeplinking"), "block");
});
