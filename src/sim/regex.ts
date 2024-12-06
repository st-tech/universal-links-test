export function stringToRegex(path: string, caseSensitive = false): RegExp {
	return new RegExp(`^${stringToRegexString(path)}$`, caseSensitive ? "" : "i");
}

/**
 * @see https://developer.apple.com/documentation/bundleresources/applinks/details/components
 */
function stringToRegexString(str: string): string {
	return (
		str
			.replace(/\./g, "\\.")
			.replace(/\+/g, "\\+")
			.replace(/\\/g, "\\\\")
			.replace(/\(/g, "\\(")
			.replace(/\)/g, "\\)")
			.replace(/\[/g, "\\[")
			.replace(/\]/g, "\\]")
			.replace(/\^/g, "\\^")
			.replace(/\$/g, "\\$")
			// In addition, you can use ?* to match one or more characters (that is, at least one character).
			.replace(/\?\*/g, ".+")
			// ? — Matches any single character.
			.replace(/\?/g, ".")
			// * — Matches zero or more characters. This performs a greedy match and matches as many characters as possible.
			.replace(/\*/g, ".*")
	);
}
