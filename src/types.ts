export type JsonOrPath = string | Record<string, unknown>;
export type PromiseOr<T> = T | Promise<T>;
export type VerifyResult = "match" | "block" | "unset";

export type CreateVerify = (
	json: JsonOrPath,
) => (path: string) => Promise<VerifyResult>;
export type Verify = (json: JsonOrPath, path: string) => Promise<VerifyResult>;
