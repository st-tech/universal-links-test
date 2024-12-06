import { validateAASA } from "../aasa.js";
import type { CreateVerify, Verify } from "../types.js";
import { resolveJson } from "./json.js";
import { match } from "./match.js";

export const createVerify: CreateVerify = (json) => {
	const aasaPromise = resolveJson(json);
	return async (path) => {
		const url = new URL(path, "https://www.example.com");
		const aasa = await aasaPromise;
		if (!validateAASA(aasa)) throw new Error("Invalid AASA");
		const details = aasa.applinks?.details;
		if (!details || details.length === 0) return "unset";

		for (const detail of details) {
			const components = detail.components;
			if (!components) continue;
			for (const component of components) {
				const percentEncoded =
					component.percentEncoded ??
					detail.defaults?.percentEncoded ??
					aasa.applinks?.defaults?.percentEncoded;
				const caseSensitive =
					component.caseSensitive ??
					detail.defaults?.caseSensitive ??
					aasa.applinks?.defaults?.caseSensitive;

				if (match(url, { ...component, percentEncoded, caseSensitive })) {
					return component.exclude ? "block" : "match";
				}
			}
		}
		return "unset";
	};
};
export const verify: Verify = (json, path) => createVerify(json)(path);
