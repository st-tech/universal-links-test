import type { ApplinksDetailsComponents } from "../aasa.js";
import { stringToRegex } from "./regex.js";

export function match(
	url: URL,
	components: ApplinksDetailsComponents,
): boolean {
	const {
		"/": path = "*",
		"?": query = "*",
		"#": fragment = "*",
		caseSensitive = true,
		percentEncoded = true,
		// percentEncoded: _ = true, // TODO: Handle percentEncoded
	} = components;

	// const urlPathname = url.pathname;
	// const urlFragment = url.hash.slice(1);
	// const urlQuery = url.search.slice(1);
	let urlPathname = url.pathname;
	let urlFragment = url.hash.slice(1);
	let urlQuery = url.search.slice(1);

	if (percentEncoded) {
		urlPathname = decodeURIComponent(urlPathname);
		urlFragment = decodeURIComponent(urlFragment);
		urlQuery = decodeURIComponent(urlQuery);
	}
	if (!stringToRegex(fragment, caseSensitive).test(urlFragment)) return false;
	if (!stringToRegex(path, caseSensitive).test(urlPathname)) return false;
	if (typeof query === "string") {
		if (!stringToRegex(query, caseSensitive).test(urlQuery)) return false;
	} else {
		for (const [key, value] of Object.entries(query)) {
			const actualValue = url.searchParams.get(key);
			if (actualValue === null) return false;
			if (!stringToRegex(value, caseSensitive).test(actualValue)) return false;
		}
	}
	return true;
}
