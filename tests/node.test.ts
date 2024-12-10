import * as assert from "node:assert";
import { test } from "node:test";
import {
	type AppleAppSiteAssociation,
	type ApplinksDetailsComponents,
	verify,
} from "universal-links-test";
import { verify as verifySim } from "universal-links-test/sim";

const getJson = (
	components: ApplinksDetailsComponents[],
): AppleAppSiteAssociation => ({
	applinks: { details: [{ appID: "HOGE.com.example.app", components }] },
});

test("empty json", async () => {
	const json = {};
	const path = "/";
	assert.strictEqual(await verify(json, path), "unset");
	assert.strictEqual(await verifySim(json, path), "unset");
});

test("invalid json", async () => {
	const json = "{[]}";
	const path = "/";
	await assert.rejects(() => verify(json, path));
	await assert.rejects(() => verifySim(json, path));
});

test("empty rule", async () => {
	const json = getJson([]);
	const path = "/";
	assert.strictEqual(await verify(json, path), "unset");
	assert.strictEqual(await verifySim(json, path), "unset");
});

test("should match path", async () => {
	const json = getJson([{ "/": "/search/" }]);
	const path = "/search/";
	assert.strictEqual(await verify(json, path), "match");
	assert.strictEqual(await verifySim(json, path), "match");
});

test("should exclude", async () => {
	const json = getJson([
		{ "#": "nondeeplinking", exclude: true },
		{ "/": "/search/" },
	]);
	const path = "/search/#nondeeplinking";
	assert.strictEqual(await verify(json, path), "block");
	assert.strictEqual(await verifySim(json, path), "block");
});

test("default case sensitive", async () => {
	const json = getJson([{ "/": "/search/" }]);
	const path = "/SEARCH/";
	assert.strictEqual(await verify(json, path), "unset");
	assert.strictEqual(await verifySim(json, path), "unset");
});

test("case insensitive", async () => {
	const json = getJson([{ "/": "/search/", caseSensitive: false }]);
	const path = "/SEARCH/";
	assert.strictEqual(await verify(json, path), "match");
	assert.strictEqual(await verifySim(json, path), "match");
});

test("should match path with query string and hash", async () => {
	const json = getJson([{ "/": "/search/" }]);
	const path = "/search/?q=foo#bar";
	assert.strictEqual(await verify(json, path), "match");
	assert.strictEqual(await verifySim(json, path), "match");
});

test("should match query string", async () => {
	const json = getJson([{ "?": "key=value" }]);
	const path = "/?key=value";
	assert.strictEqual(await verify(json, path), "match");
	assert.strictEqual(await verifySim(json, path), "match");
});

test("should not match query string with extras", async () => {
	const json = getJson([{ "?": "key=value" }]);
	const path = "/?key=value&extra=value";
	assert.strictEqual(await verify(json, path), "unset");
	assert.strictEqual(await verifySim(json, path), "unset");
});

test("should match query string with key-value object", async () => {
	const json = getJson([{ "?": { key: "value" } }]);
	const path = "/?key=value";
	assert.strictEqual(await verify(json, path), "match");
	assert.strictEqual(await verifySim(json, path), "match");
});

test("should match query string with key-value object with extras", async () => {
	const json = getJson([{ "?": { key: "value" } }]);
	const path = "/?key=value&extra=value";
	assert.strictEqual(await verify(json, path), "match");
	assert.strictEqual(await verifySim(json, path), "match");
});

test("should unset appIDs and appID not provided", async () => {
	const json = {
		applinks: { details: [{ components: [{ "/": "/search/" }] }] },
	};
	const path = "/search/";
	assert.strictEqual(await verify(json, path), "unset");
	assert.strictEqual(await verifySim(json, path), "unset");
});
