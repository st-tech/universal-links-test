import { spawn } from "node:child_process";

/** Downloads an A-A-S-A file from a domain. If specified, the timeout is in seconds. */
type DlCommand = { command: "dl"; domain: string; timeout?: number };
/** Gets info about apps and/or domains. */
type GetCommand = {
	command: "get";
	service?: string;
	appId?: string;
	domain?: string;
};
/** Open a URL as a universal link. */
type OpenulCommand = { command: "openul"; url: string; referrerUrl?: string };
/**  Show the current state. */
type ShowCommand = { command: "show" };
/** Verify apple-app-site-association files. Use -u to match a URL. */
type VerifyCommand = {
	command: "verify";
	domain?: string;
	json: string | Record<string, unknown>;
	url?: string;
};
/** Reset the database and restart swcd. */
type ResetCommand = { command: "reset" };
/** Watch the system log for SWC logging. Specify --verbose to enable debug-level logging. */
type WatchCommand = { command: "watch" };
/** Test a pattern-matching dictionary against a URL. */
type MatchCommand = {
	command: "match";
	url: string;
	json: string | Record<string, unknown>;
};
/** Enable or disable developer mode. */
type DeveloperModeCommand = { command: "developer-mode"; enable: boolean };
export type Command =
	| DlCommand
	| GetCommand
	| OpenulCommand
	| ShowCommand
	| VerifyCommand
	| ResetCommand
	| WatchCommand
	| MatchCommand
	| DeveloperModeCommand;

export type SharedOptions = {
	/** Run leaks before termination. */
	leaks?: boolean;
	/** Run vmmap before termination. */
	vmmap?: boolean;
	/** Run heap before termination. */
	heap?: boolean;
	/** Increase verbosity of output. */
	verbose?: boolean;
};

export type Options = SharedOptions & Command;

export type Result = {
	stdout: string;
	stderr: string;
	status: number;
};

export function swcutil(options: Options): Promise<Result> {
	const res = spawn("swcutil", [
		...buildSharedOptionArgs(options),
		...buildCommandArgs(options),
	]);

	const stdout: string[] = [];
	const stdoutListener = (data: { toString(): string }) =>
		stdout.push(data.toString());

	const stderr: string[] = [];
	const stderrListener = (data: { toString(): string }) =>
		stderr.push(data.toString());

	res.stdout.on("data", stdoutListener);
	res.stderr.on("data", stderrListener);

	return new Promise<Result>((resolve, reject) => {
		res.on("close", (status) => {
			resolve({
				stdout: stdout.join(""),
				stderr: stderr.join(""),
				status: status || 0,
			});
		});
		res.on("error", reject);
	}).finally(() => {
		res.stdout.off("data", stdoutListener);
		res.stderr.off("data", stderrListener);
	});
}

function buildSharedOptionArgs(options: SharedOptions): string[] {
	return [
		...(options.leaks ? ["--leaks"] : []),
		...(options.vmmap ? ["--vmmap"] : []),
		...(options.heap ? ["--heap"] : []),
		...(options.verbose ? ["--verbose"] : []),
	];
}

function buildCommandArgs(command: Command): string[] {
	switch (command.command) {
		case "dl":
			return [
				"dl",
				...["-d", command.domain],
				...(command.timeout ? ["-t", command.timeout.toString()] : []),
			];
		case "get":
			return [
				"get",
				...(command.service ? ["-s", command.service] : []),
				...(command.appId ? ["-a", command.appId] : []),
				...(command.domain ? ["-d", command.domain] : []),
			];
		case "openul":
			return [
				"openul",
				...["-u", command.url],
				...(command.referrerUrl ? ["-r", command.referrerUrl] : []),
			];
		case "verify":
			return [
				"verify",
				...(command.domain ? ["-d", command.domain] : []),
				...(command.url ? ["-u", command.url] : []),
				...[
					"-j",
					typeof command.json === "string"
						? command.json
						: JSON.stringify(command.json),
				],
			];
		case "match":
			return [
				"match",
				...["-u", command.url],
				...[
					"-j",
					typeof command.json === "string"
						? command.json
						: JSON.stringify(command.json),
				],
			];
		case "developer-mode":
			return ["developer-mode", "-e", command.enable ? "true" : "false"];
		default:
			// command as Omit<typeof command, "command"> satisfies Record<
			// 	string,
			// 	never
			// >;
			return [command.command];
	}
}
