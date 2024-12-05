import * as assert from "node:assert";
import { test } from "node:test";
import {
	verify,
	type AppleAppSiteAssociation,
} from "apple-app-site-association";

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
	const actual = await verify("example.com", "/search/", json);
	assert.strictEqual(actual, "match");
});

test("#nondeeplinking should block", async () => {
	const actual = await verify("example.com", "/search/#nondeeplinking", json);
	assert.strictEqual(actual, "block");
});
