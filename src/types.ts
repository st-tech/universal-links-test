/** @see https://developer.apple.com/documentation/bundleresources/applinks */
export type Applinks = {
	defaults?: ApplinksDefaults;
	details?: readonly ApplinksDetails[];
	substitutionVariables?: ApplinksSubstitutionVariables;
};
/** @see https://developer.apple.com/documentation/bundleresources/applinks/defaults */
export type ApplinksDefaults = {
	caseSensitive?: boolean;
	percentEncoded?: boolean;
};
/** @see https://developer.apple.com/documentation/bundleresources/applinks/details */
export type ApplinksDetails = {
	appID?: string;
	appIDs?: readonly string[];
	components?: readonly ApplinksDetailsComponents[];
	defaults?: ApplinksDefaults;
};
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
/** @see https://developer.apple.com/documentation/bundleresources/applinks/details/components/query */
export type ApplinksDetailsComponentsQuery = Record<string, string>;
/** @see https://developer.apple.com/documentation/bundleresources/applinks/substitutionvariables */
export type ApplinksSubstitutionVariables = Record<string, readonly string[]>;

export type AppleAppSiteAssociation = {
	applinks?: Applinks;
};

export type JsonOrPath = string | Record<string, unknown>;
export type PromiseOr<T> = T | Promise<T>;
export type VerifyResult = "match" | "block" | "unset";
