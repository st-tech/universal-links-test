import * as v from "valibot";

/** @see https://developer.apple.com/documentation/bundleresources/applinks/details/components/query */
export const ApplinksDetailsComponentsQuerySchema = v.record(
	v.string(),
	v.string(),
);
export type ApplinksDetailsComponentsQuery = v.InferInput<
	typeof ApplinksDetailsComponentsQuerySchema
>;
/** @see https://developer.apple.com/documentation/bundleresources/applinks/substitutionvariables */
export const ApplinksSubstitutionVariablesSchema = v.record(
	v.string(),
	v.array(v.string()),
);
export type ApplinksSubstitutionVariables = v.InferInput<
	typeof ApplinksSubstitutionVariablesSchema
>;
/** @see https://developer.apple.com/documentation/bundleresources/applinks/details/components */
export const ApplinksDetailsComponentsSchema = v.object({
	"/": v.optional(v.string()),
	"?": v.optional(v.union([v.string(), ApplinksDetailsComponentsQuerySchema])),
	"#": v.optional(v.string()),
	exclude: v.optional(v.boolean()),
	comment: v.optional(v.string()),
	caseSensitive: v.optional(v.boolean()),
	percentEncoded: v.optional(v.boolean()),
});
export type ApplinksDetailsComponents = v.InferInput<
	typeof ApplinksDetailsComponentsSchema
>;
/** @see https://developer.apple.com/documentation/bundleresources/applinks/defaults */
export const ApplinksDefaultsSchema = v.object({
	caseSensitive: v.optional(v.boolean()),
	percentEncoded: v.optional(v.boolean()),
});
export type ApplinksDefaults = v.InferInput<typeof ApplinksDefaultsSchema>;
/** @see https://developer.apple.com/documentation/bundleresources/applinks/details */
export const ApplinksDetailsSchema = v.object({
	appID: v.optional(v.string()),
	appIDs: v.optional(v.array(v.string())),
	components: v.optional(v.array(ApplinksDetailsComponentsSchema)),
	defaults: v.optional(ApplinksDefaultsSchema),
});
export type ApplinksDetails = v.InferInput<typeof ApplinksDetailsSchema>;
/** @see https://developer.apple.com/documentation/bundleresources/applinks */
export const ApplinksSchema = v.object({
	defaults: v.optional(ApplinksDefaultsSchema),
	details: v.optional(ApplinksDetailsSchema),
	substitutionVariables: v.optional(ApplinksSubstitutionVariablesSchema),
});
export type Applinks = v.InferInput<typeof ApplinksSchema>;
export const AASASchema = v.object({
	applinks: v.optional(ApplinksSchema),
});
export type AASA = v.InferInput<typeof AASASchema>;

export type JsonOrPath = string | Record<string, unknown>;
export type PromiseOr<T> = T | Promise<T>;
export type VerifyResult = "match" | "block" | "unset";
