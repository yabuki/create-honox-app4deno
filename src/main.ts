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

import {
askOverwrite,
  checkDenoInstalled,
	createNewDirectory,
	installNpmModules,
	isDircectoryExists,
	removeDirectory,
	setProjectName
} from "./files.ts"
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
      { default: ".", required: false })
    .option(
      "-f, --force [force:boolean]",
      "Force overwrite if the directory already exists",
      { default: false, required: false }
    ) // デフォルト値の例
    .action(async (options: { directory: string | true, force: boolean }, projectName?: string) => {
      let path_and_dirname: string;
      // options.directory が string または true になるため、string に変換または確認する
      const baseDir: string = typeof options.directory === 'string' ? options.directory : '.';

      if (projectName) {
        $.log(`Creating project with name: ${projectName}`);
        $.log(`Creating in directory: ${options.directory}`);
        // プロジェクト作成処理 (projectName, options.directory を利用)
        path_and_dirname = path.resolve(
          baseDir,
          projectName,
        );
        $.logLight("path_and_dirname: ", path_and_dirname);
      } else {
        $.logWarn("Project name not provided.");
        path_and_dirname = path.resolve(
          baseDir,
          await setProjectName()
        );
      }
      // $.log("force: ", options.force);
      // 存在チェック
      if (isDircectoryExists(path_and_dirname)) {
        if (options.force) {
          $.logWarn("Force option is set. Overwriting...");
          // ここで上書き処理を行う
          if (await askOverwrite()) {
            $.logWarn("Overwriting...");
            await removeDirectory(path_and_dirname);
          }else{
            $.logWarn("Aborting...");
            Deno.exit(1);
          }
        } else {
          $.log("Directory already exists. Use --force to overwrite.");
          Deno.exit(1);
        }
      }
      await createNewDirectory(path_and_dirname);
      await installNpmModules(path_and_dirname);
    })
    .parse(Deno.args);
  
  } else {
    $.logError("Deno is not installed.");
    $.logError("Please install Deno.");
    Deno.exit(1);
  } 
}
