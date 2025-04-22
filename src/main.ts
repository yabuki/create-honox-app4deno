/**
 * @fileoverview
 * @description This is a simple CLI application that sets up a HonoX development environment for Deno.
 * It uses the @cliffy/command library to handle command-line arguments and options.
 * @license Apache-2.0
 * @author Yukiharu YABUKI <yabuki@netfort.gr.jp>
 * see LICENSE for details.
 */
import { Command } from "@cliffy/command";
import * as path from "@std/path";

type options = {
	directory: string;
};

await new Command()
	.name("create-honox-app4deno")
	.version("0.0.1")
	.description("Set up HonoX develop environment for Deno.")
	.usage("[project-name]")
	.arguments("[projectName:string]")
	.option(
		"-d, --directory [directory:string]",
		"Directory to create the project in",
		{ default: "." },
	) // デフォルト値の例
	.action((options: { directory: string }, projectName?: string) => {
		if (projectName) {
			console.log(`Creating project with name: ${projectName}`);
			console.log(`Creating in directory: ${options.directory}`);
			// プロジェクト作成処理 (projectName, options.directory を利用)
			const path_and_dirname: string = path.resolve(
				options.directory,
				projectName,
			);
			console.log("path_and_dirname: ", path_and_dirname);
		} else {
			console.log("Project name not provided.");
		}
	})
	.parse(Deno.args);

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	// console.log("Add 2 + 3 =", add(2, 3));
}
