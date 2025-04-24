/**
 * @fileoverview
 * @description This is a simple CLI application that sets up a HonoX development environment for Deno.
 * It uses the @cliffy/command library to handle command-line arguments and options.
 * @license Apache-2.0
 * @author Yukiharu YABUKI <yabuki@netfort.gr.jp>
 * see LICENSE for details.
 */
import { parseArgs } from "@std/cli";
import { exists } from "@std/fs/exists";
import { UntarStream } from "@std/tar/untar-stream";
import { dirname, normalize, resolve } from "@std/path";
import { writeEmbbedfile } from "./embed_files.ts";
import { embeddedFile } from "./embeddedFiles.ts";
import {
	askOverwrite,
	checkDenoInstalled,
	createNewDirectory,
	installNpmModules,
	isDircectoryExists,
	removeDirectory,
	setProjectName,
} from "./files.ts";

import $ from "@david/dax";


type projectType = {
	dirName: string;
};

type templateType = {
	baseDir: string;
	fileName: string;
	fullPath: string;
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
// プログラムのエントリーポイントかどうかを確認する。
if (import.meta.main) {
	const args = parseArgs( Deno.args );
	const count = args._.length;
	// $.log({ args });
	if (count > 1) {
		$.log("Too many arguments.");
		$.log("Usage: create-honox-app4deno [project-name]");
		Deno.exit(1);
	}
	if (count === 0) {
		$.log("No project Directory name given.");
		$.log("Please give project Directory name.");
		$.log("Usage: create-honox-app4deno [project-dirname]");
		$.log("Example: create-honox-app4deno myProject");
	}
	const project: projectType = {
				dirName: typeof args._[0] === "string" ? args._[0] : "",
	};
	if (project.dirName === ""){
		$.logError("Project name is empty.");
		$.logError("Please give project directory name.");
		Deno.exit(1);
	}
	if (await exists(project.dirName)){
		$.logError("Aborting... Directory already exists.");
		$.logError("Please choose another directory name.");
		Deno.exit(1);
	};
	// Deno がインストールされているか?
	if (!checkDenoInstalled()) {
		$.logError("Deno is not installed.");
		$.logError("Please install Deno. Then Try again.");
		Deno.exit(1);
	}
	const tempdir = Deno.makeTempDirSync({
		prefix: "create-honox-app4deno",
	})
	const targz = "template.tar.gz";
	const template = {
		baseDir: tempdir,
		fileName: targz,
		fullPath: resolve(tempdir, targz)
	};
	await extractTarGz(template);
	await createNewDirectory(
		resolve(template.baseDir, "template/"),
		project.dirName,
	);
	await installNpmModules(project.dirName);
	// mkTempDirの後始末
	await removeDirectory(template.baseDir);
}

async function extractTarGz(
	template: templateType,
): Promise<void> {
	// テンポラリディレクトリに template.tar.gz を展開する。
	console.log("Writing template.tar.gz to", template.fullPath);
	writeEmbbedfile(template.fullPath, embeddedFile);

	console.log("Unpacking template to", template.fullPath);

	for await (
		const entry of (await Deno.open(template.fullPath, { read: true }))
			.readable
			.pipeThrough(new DecompressionStream("gzip"))
			.pipeThrough(new UntarStream())
	) {
		// tempdirで作ったディレクトリに展開する。
		const path = resolve(template.baseDir, normalize(entry.path));
		await Deno.mkdir(dirname(path), { recursive: true });
		await entry.readable?.pipeTo((await Deno.create(path)).writable);
	}
}