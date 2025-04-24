/**
 * @fileoverview
 * @description This is a simple CLI application that sets up a HonoX development environment for Deno.
 * It uses the @cliffy/command library to handle command-line arguments and options.
 * @license Apache-2.0
 * @author Yukiharu YABUKI <yabuki@netfort.gr.jp>
 * see LICENSE for details.
 */
import { Command } from "@cliffy/command";
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

type options = {
	directory: string;
	force: boolean;
};

type projectType = {
	dirName: string | undefined;
	baseDir: string;
	dirNameWithPath: string;
	overWrite: boolean;
};

type templateType = {
	baseDir: string;
	fileName: string;
	fullPath: string;
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
// プログラムのエントリーポイントかどうかを確認する。
if (import.meta.main) {
	// ここにメインの処理を書く
	await new Command()
		.name("create-honox-app4deno")
		.version("0.0.1")
		.description("Set up HonoX develop environment for Deno.")
		.usage("[project-name]")
		.arguments("[projectName:string]")
		.option(
			"-d, --directory [directory:string]",
			"Directory to create the project in",
			{ default: ".", required: false },
		)
		.option(
			"-f, --force [force:boolean]",
			"Force overwrite if the directory already exists",
			{ default: false, required: false },
		) // デフォルト値の例
		.action(
			async (
				options: { directory: string | true; force: boolean },
				projectDirName?: string,
			): Promise<void> => {
				// HonoXのプロジェクトを生成するのに必要な情報を持つオブジェクト
				const project = {
					dirName: projectDirName, // ユーザが与えたプロジェクト名 与えられないこともある。
					// baseDir: オプションで与えられるかも知れないパス
					// options.directory が オプション(-d / --directory)で与えられた
					// プロジェクトディレクトリ名 または カレントディレクトリの"."
					// になる。
					baseDir: typeof options.directory === "string"
						? options.directory
						: ".",
					dirNameWithPath: "", // プロジェクトディレクトリ名とパスを結合したもの
					overWrite: options.force, // 上書き指定されたか? trueなら上書きする。
				};
				// templatを展開するのに必要な情報を持つオブジェクト
				const template = {
					baseDir: Deno.makeTempDirSync({
						prefix: "create-honox-app4deno",
					}),
					fileName: "template.tar.gz",
					fullPath: "",
					setFullPath: function (template: templateType): string {
						return resolve(template.baseDir, template.fileName);
					},
				};
				// Deno がインストールされているか?
				if (!checkDenoInstalled()) {
					$.logError("Deno is not installed.");
					$.logError("Please install Deno.");
					Deno.exit(1);
				}
				await decideProjectPath(project);
				await confirmOverwrite(project);
				//
				template.fullPath = template.setFullPath(template);

				extractTarGz(template);
				//
				await createNewDirectory(
					resolve(template.baseDir, "template/"),
					project.dirNameWithPath,
				);
				await installNpmModules(project.dirNameWithPath);
				// mkTempDirの後始末
				await removeDirectory(template.baseDir);
			},
		)
		.parse(Deno.args);
}

/**
 * @param project {projectType}
 * @returns {Promise<void>}
 * @description プロジェクトのディレクトリ名を決定する。
 */
async function decideProjectPath(project: projectType): Promise<void> {
	if (project.dirName) {
		project.dirNameWithPath = resolve(
			project.baseDir,
			project.dirName,
		);
		$.logLight("Project Dirname with Path: ", project.dirNameWithPath);
	} else {
		// 引数がない場合は、プロジェクト名を聞く。
		$.logWarn("You did not give project directory name.");
		project.dirNameWithPath = resolve(
			project.baseDir,
			await setProjectName(),
		);
	}
}

async function confirmOverwrite(project: projectType): Promise<void> {
	if (isDircectoryExists(project.dirNameWithPath)) {
		if (project.overWrite) {
			$.logWarn("Force option is set. Overwriting...");
			// ここで上書き処理を行う
			if (await askOverwrite()) {
				$.logWarn("Overwriting...");
				await removeDirectory(project.dirNameWithPath);
			} else {
				$.logWarn("Aborting...");
				Deno.exit(1);
			}
		} else {
			$.log("Directory already exists. Use --force to overwrite.");
			Deno.exit(1);
		}
	}
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