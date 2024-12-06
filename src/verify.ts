import { swcutil } from "./swcutil.js";
import type { CreateVerify, Verify } from "./types.js";

export const createVerify: CreateVerify = (json) => async (path) => {
	const res = await swcutil({
		command: "verify",
		json,
		url: path,
	});
	if (res.status !== 0) throw new Error(res.stderr);
	const out = res.stdout.trimEnd();
	if (out.endsWith("matched.")) return "match";
	if (out.endsWith("blocked match.")) return "block";
	return "unset";
};
export const verify: Verify = (json, path) => createVerify(json)(path);
