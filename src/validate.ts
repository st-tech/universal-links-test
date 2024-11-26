import { parse } from "valibot";
import { type AASA, AASASchema } from "./types.js";

/**
 * Validate AASA(apple-app-site-association) JSON.
 * @param json AASA JSON
 * @returns Typed AASA JSON
 * @throws If the JSON is invalid
 */
export function validate(json: unknown): AASA {
	return parse(AASASchema, json);
}
