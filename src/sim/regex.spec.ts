import { expect, it } from "vitest";
import { stringToRegex } from "./regex.js";

it("`?` matches any single character", () => {
	const regex = stringToRegex("a?b");
	expect(regex.source).toBe("^a.b$");
});

it("`*` matches zero or more characters", () => {
	const regex = stringToRegex("a*b");
	expect(regex.source).toBe("^a.*b$");
});

it("`?*` matches one or more characters", () => {
	const regex = stringToRegex("a?*b");
	expect(regex.source).toBe("^a.+b$");
});

it("escapes special characters", () => {
	const regex = stringToRegex("^(a.+)[b]$");
	expect(regex.source).toBe("^\\^\\(a\\.\\+\\)\\[b\\]\\$$");
});

it("is case-insensitive by default", () => {
	const regex = stringToRegex("a?b");
	expect(regex.flags).toBe("i");
});

it("can be case-sensitive", () => {
	const regex = stringToRegex("a?b", true);
	expect(regex.flags).toBe("");
});
