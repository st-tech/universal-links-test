import {
	compressToEncodedURIComponent,
	decompressFromEncodedURIComponent,
} from "lz-string";

const jsonKey = "j";
const pathsKey = "p";

export const getHash = (aasa: string, paths: string[]) => {
	return compressToEncodedURIComponent(
		JSON.stringify({
			[jsonKey]: JSON.parse(aasa),
			[pathsKey]: paths,
		}),
	);
};
export const parseHash = (hash: string): { json: unknown; paths: string[] } => {
	const parsed = JSON.parse(decompressFromEncodedURIComponent(hash));
	return { json: parsed[jsonKey], paths: parsed[pathsKey] };
};
