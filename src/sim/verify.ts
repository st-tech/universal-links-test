import { validateAASA } from "../aasa.js";
import type { CreateVerify, Verify, VerifyResult } from "../types.js";
import { resolveJson } from "./json.js";
import { match } from "./match.js";

export const createVerify: CreateVerify = (json) => {
	const aasaPromise = resolveJson(json);
	return async (path) => {
		const url = new URL(path, "https://www.example.com");
		const aasa = await aasaPromise;
		if (!validateAASA(aasa)) throw new Error("Invalid AASA");
		const details = aasa.applinks?.details;
		const ret = new Map<string, VerifyResult>();
		if (!details || details.length === 0) return ret;

		for (const detail of details) {
			if (!detail.appID && (!detail.appIDs || detail.appIDs.length === 0))
				continue;

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
					const res = component.exclude ? "block" : "match";
					if (detail.appIDs) {
						for (const appID of detail.appIDs) {
							if (!ret.has(appID)) ret.set(appID, res);
						}
					} else if (detail.appID) {
						if (!ret.has(detail.appID)) ret.set(detail.appID, res);
					}
					break;
				}
			}
		}
		return ret;
	};
};

/**
 * Verify the URL with the apple-app-site-association file.
 * This function simulates the `swcutil` command behavior.
 * @param json apple-app-site-association file content or path
 * @param path URL to verify
 * @returns Map of appID and match/block
 */
export const verify: Verify = (json, path) => createVerify(json)(path);
