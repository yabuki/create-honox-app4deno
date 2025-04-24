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

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
// プログラムのエントリーポイントかどうかを確認する。
if (import.meta.main) {
	// ここにメインの処理を書く
	if (checkDenoInstalled()) {
		$.log("Deno is installed.");
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
					projectName?: string,
				): Promise<void> => {
					let projctDirNameWithPath: string;
					// options.directory が string または true になるため、string に変換または確認する
					const baseDir: string = typeof options.directory === "string"
						? options.directory
						: ".";

					if (projectName) {
						$.log(`Creating project directory: ${projectName}`);
						$.log(`Creating in directory: ${options.directory}`);
						// プロジェクト作成処理 (projectName, options.directory を利用)
						projctDirNameWithPath = resolve(
							baseDir,
							projectName,
						);
						$.logLight("Project Dirname with Path: ", projctDirNameWithPath);
					} else {
						$.logWarn("Project name not provided.");
						projctDirNameWithPath = resolve(
							baseDir,
							await setProjectName(),
						);
					}
					// $.log("force: ", options.force);
					// 存在チェック
					if (isDircectoryExists(projctDirNameWithPath)) {
						if (options.force) {
							$.logWarn("Force option is set. Overwriting...");
							// ここで上書き処理を行う
							if (await askOverwrite()) {
								$.logWarn("Overwriting...");
								await removeDirectory(projctDirNameWithPath);
							} else {
								$.logWarn("Aborting...");
								Deno.exit(1);
							}
						} else {
							$.log("Directory already exists. Use --force to overwrite.");
							Deno.exit(1);
						}
					}
					//
					const templatePath = Deno.makeTempDirSync({ prefix: "create-honox-app4deno" });
					const templatePath_and_File = resolve(
						templatePath,
						"template.tar.gz",
					);
					console.log("Writing template to", templatePath_and_File);

					// テンポラリディレクトリに template.tar.gz を展開する。
					writeEmbbedfile(templatePath_and_File, embeddedFile);

					// Deno.exit(0);

					// Read a file
					// const templateContent: Uint8Array = Deno.readFileSync(import.meta.dirname + "/../template.tar.gz");
					const templateContent: Uint8Array = Deno.readFileSync(
						templatePath_and_File,
					);

					// バイナリ内容をファイルに書き出す
					Deno.writeFileSync(templatePath_and_File, templateContent);

					console.log("Unpacking template to", templatePath_and_File);

					for await (
						const entry
							of (await Deno.open(templatePath_and_File, { read: true }))
								.readable
								.pipeThrough(new DecompressionStream("gzip"))
								.pipeThrough(new UntarStream())
					) {
						// tempdirで作ったディレクトリに展開する。
						const path = resolve(templatePath, normalize(entry.path));
						await Deno.mkdir(dirname(path), { recursive: true });
						await entry.readable?.pipeTo((await Deno.create(path)).writable);
					}
					//
					await createNewDirectory(
						resolve(templatePath, "template/"),
						projctDirNameWithPath,
					);
					await installNpmModules(projctDirNameWithPath);
					// mkTempDirの後始末
					await removeDirectory(templatePath);
				},
			)
			.parse(Deno.args);
	} else {
		$.logError("Deno is not installed.");
		$.logError("Please install Deno.");
		Deno.exit(1);
	}
}
