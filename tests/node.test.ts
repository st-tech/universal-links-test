import * as assert from "node:assert";
import { it } from "node:test";
import { type ApplinksDetails, verify } from "universal-links-test";
import { verify as verifySim } from "universal-links-test/sim";

const fromDetails = (...details: ApplinksDetails[]) => ({
	applinks: { details },
});

it("empty json", async () => {
	const json = {};
	const path = "/";
	const expected = new Map();
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("invalid json", async () => {
	const json = "{[]}";
	const path = "/";
	await assert.rejects(() => verify(json, path));
	await assert.rejects(() => verifySim(json, path));
});

it("empty rule", async () => {
	const json = fromDetails({ appID: "HOGE.com.example.app", components: [] });
	const path = "/";
	const expected = new Map();
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should match path", async () => {
	const json = fromDetails({
		appID: "HOGE.com.example.app",
		components: [{ "/": "/search/" }],
	});
	const path = "/search/";
	const expected = new Map([["HOGE.com.example.app", "match"]]);
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should exclude", async () => {
	const json = fromDetails({
		appID: "HOGE.com.example.app",
		components: [{ "#": "nondeeplinking", exclude: true }, { "/": "/search/" }],
	});
	const path = "/search/#nondeeplinking";
	const expected = new Map([["HOGE.com.example.app", "block"]]);
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("default case sensitive", async () => {
	const json = fromDetails({
		appID: "HOGE.com.example.app",
		components: [{ "/": "/search/" }],
	});
	const path = "/SEARCH/";
	const expected = new Map();
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("case insensitive", async () => {
	const json = fromDetails({
		appID: "HOGE.com.example.app",
		components: [{ "/": "/search/", caseSensitive: false }],
	});
	const path = "/SEARCH/";
	const expected = new Map([["HOGE.com.example.app", "match"]]);
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should match path with query string and hash", async () => {
	const json = fromDetails({
		appID: "HOGE.com.example.app",
		components: [{ "/": "/search/" }],
	});
	const path = "/search/?q=foo#bar";
	const expected = new Map([["HOGE.com.example.app", "match"]]);
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should match query string", async () => {
	const json = fromDetails({
		appID: "HOGE.com.example.app",
		components: [{ "?": "key=value" }],
	});
	const path = "/?key=value";
	const expected = new Map([["HOGE.com.example.app", "match"]]);
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should not match query string with extras", async () => {
	const json = fromDetails({
		appID: "HOGE.com.example.app",
		components: [{ "?": "key=value" }],
	});
	const path = "/?key=value&extra=value";
	const expected = new Map();
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should match query string with key-value object", async () => {
	const json = fromDetails({
		appID: "HOGE.com.example.app",
		components: [{ "?": { key: "value" } }],
	});
	const path = "/?key=value";
	const expected = new Map([["HOGE.com.example.app", "match"]]);
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should match query string with key-value object with extras", async () => {
	const json = fromDetails({
		appID: "HOGE.com.example.app",
		components: [{ "?": { key: "value" } }],
	});
	const path = "/?key=value&extra=value";
	const expected = new Map([["HOGE.com.example.app", "match"]]);
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should unset appIDs and appID not provided", async () => {
	const json = fromDetails({ components: [{ "/": "/search/" }] });
	const path = "/search/";
	const expected = new Map();
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should ignore appID if appIDs provided", async () => {
	const json = fromDetails({
		appID: "FOO.com.example.app",
		appIDs: [],
		components: [{ "/": "/search/" }],
	});
	const path = "/search/";
	const expected = new Map();
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should match multiple appIDs (appID is ignored)", async () => {
	const json = fromDetails({
		appID: "FOO.com.example.app",
		appIDs: ["BAR.com.example.app", "BAZ.com.example.app"],
		components: [{ "/": "/search/" }],
	});
	const path = "/search/";
	const expected = new Map([
		["BAR.com.example.app", "match"],
		["BAZ.com.example.app", "match"],
	]);
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});

it("should handle multiple details", async () => {
	const json = fromDetails(
		{
			appID: "HOGE.com.example.app",
			components: [{ "/": "/search/" }],
		},
		{
			appID: "HOGE.com.example.app",
			components: [{ "/": "/search/", exclude: true }],
		},
	);
	const path = "/search/";
	const expected = new Map([["HOGE.com.example.app", "match"]]);
	assert.deepStrictEqual(await verify(json, path), expected);
	assert.deepStrictEqual(await verifySim(json, path), expected);
});
