export type JsonOrPath = string | Record<string, unknown>;
export type PromiseOr<T> = T | Promise<T>;
export type ResultMap = Map<string, VerifyResult>;
export type VerifyResult = "match" | "block";

export type CreateVerify = (
	json: JsonOrPath,
) => (path: string) => Promise<ResultMap>;
export type Verify = (json: JsonOrPath, path: string) => Promise<ResultMap>;
