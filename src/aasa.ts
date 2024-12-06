/** @see https://developer.apple.com/documentation/bundleresources/applinks */
export type Applinks = {
	defaults?: ApplinksDefaults;
	details?: readonly ApplinksDetails[];
	substitutionVariables?: ApplinksSubstitutionVariables;
};
export function validateApplinks(applinks: unknown): applinks is Applinks {
	if (!obj(applinks)) return false;
	if ("defaults" in applinks && !validateApplinksDefaults(applinks.defaults))
		return false;
	if ("details" in applinks && !tArr(applinks.details, validateApplinksDetails))
		return false;
	if (
		"substitutionVariables" in applinks &&
		!validateApplinksSubstitutionVariables(applinks.substitutionVariables)
	)
		return false;
	return true;
}
/** @see https://developer.apple.com/documentation/bundleresources/applinks/defaults */
export type ApplinksDefaults = {
	caseSensitive?: boolean;
	percentEncoded?: boolean;
};
export function validateApplinksDefaults(
	defaults: unknown,
): defaults is ApplinksDefaults {
	if (!obj(defaults)) return false;
	if ("caseSensitive" in defaults && !bool(defaults.caseSensitive))
		return false;
	if ("percentEncoded" in defaults && !bool(defaults.percentEncoded))
		return false;
	return true;
}
/** @see https://developer.apple.com/documentation/bundleresources/applinks/details */
export type ApplinksDetails = {
	appID?: string;
	appIDs?: readonly string[];
	components?: readonly ApplinksDetailsComponents[];
	defaults?: ApplinksDefaults;
};
export function validateApplinksDetails(
	details: unknown,
): details is ApplinksDetails {
	if (!obj(details)) return false;
	if ("appID" in details && !str(details.appID)) return false;
	if ("appIDs" in details && !strArr(details.appIDs)) return false;
	if (
		"components" in details &&
		!tArr(details.components, validateApplinksDetailsComponents)
	)
		return false;
	if ("defaults" in details && !validateApplinksDefaults(details.defaults))
		return false;
	return true;
}
/** @see https://developer.apple.com/documentation/bundleresources/applinks/details/components */
export type ApplinksDetailsComponents = {
	"/"?: string;
	"?"?: string | ApplinksDetailsComponentsQuery;
	"#"?: string;
	exclude?: boolean;
	comment?: string;
	caseSensitive?: boolean;
	percentEncoded?: boolean;
};
export function validateApplinksDetailsComponents(
	components: unknown,
): components is ApplinksDetailsComponents {
	if (!obj(components)) return false;
	if ("/" in components && !str(components["/"])) return false;
	if (
		"?" in components &&
		!(
			str(components["?"]) ||
			validateApplinksDetailsComponentsQuery(components["?"])
		)
	)
		return false;
	if ("#" in components && !str(components["#"])) return false;
	if ("exclude" in components && !bool(components.exclude)) return false;
	if ("comment" in components && !str(components.comment)) return false;
	if ("caseSensitive" in components && !bool(components.caseSensitive))
		return false;
	if ("percentEncoded" in components && !bool(components.percentEncoded))
		return false;
	return true;
}
/** @see https://developer.apple.com/documentation/bundleresources/applinks/details/components/query */
export type ApplinksDetailsComponentsQuery = Record<string, string>;
export function validateApplinksDetailsComponentsQuery(
	query: unknown,
): query is ApplinksDetailsComponentsQuery {
	if (!obj(query)) return false;
	if (!Object.values(query).every(str)) return false;
	return true;
}
/** @see https://developer.apple.com/documentation/bundleresources/applinks/substitutionvariables */
export type ApplinksSubstitutionVariables = Record<string, readonly string[]>;
export function validateApplinksSubstitutionVariables(
	substitutionVariables: unknown,
): substitutionVariables is ApplinksSubstitutionVariables {
	if (!obj(substitutionVariables)) return false;
	if (!Object.values(substitutionVariables).every(strArr)) return false;
	return true;
}

export type AppleAppSiteAssociation = {
	applinks?: Applinks;
};
export function validateAASA(aasa: unknown): aasa is AppleAppSiteAssociation {
	if (!obj(aasa)) return false;
	return "applinks" in aasa && validateApplinks(aasa.applinks);
}

function obj(o: unknown) {
	return typeof o === "object" && o !== null;
}
function str(s: unknown) {
	return typeof s === "string";
}
function bool(b: unknown) {
	return typeof b === "boolean";
}
function arr(a: unknown) {
	return Array.isArray(a);
}
function tArr<T>(a: unknown, validate: (v: unknown) => v is T) {
	return arr(a) && a.every(validate);
}
function strArr(a: unknown) {
	return tArr(a, str);
}
