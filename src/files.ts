/*
 * This file is Apache-2.0 licensed. See LICENSE for details.
 */
import $ from "@david/dax";
import { assert } from "@std/assert/assert";

export async function createNewDirectory(
	path_and_filename: string,
): Promise<boolean> {
	if (isDircectoryExists(path_and_filename)) {
		console.log("Directory or file already exists");
		return false;
	}
	console.log("Creating directory: ", path_and_filename);
	// createDirectory(path_and_filename);
	await copyDirectory("template/", path_and_filename);
	return true;
}
// async function createDirectory(path: string){
//   await $`mkdir -p ${path}`;
// }
async function copyDirectory(src: string, dest: string) {
	// console.log("current dir: ", Deno.cwd());
	console.log("src: ", src);
	console.log("dest: ", dest);
	await $`cp -r ${src} ${dest}`;
}

/**
 * 引数のパスとファイル名の組み合わせでディレクトリが作成
 * 可能かどうかを調べる。
 * すでに同名のファイル、ディレクトリ、シンボリックリンク
 * が存在する時は、trueを返す。何もないときだけfalseを返す。
 * @param path_and_filename
 * @returns
 */
export function isDircectoryExists(path_and_filename: string): boolean {
	try {
		const file_info = Deno.statSync(path_and_filename);
		if (file_info.isFile) {
			console.log("File exists");
			return true;
		}
		if (file_info.isSymlink) {
			console.log("Symlink exists");
			return true;
		}
		if (file_info.isDirectory) {
			console.log("Directory exists");
			return true;
		}
		assert(false, "Unknown file type");
		return false;
	} catch (e) {
		if (e instanceof Deno.errors.NotFound) {
			console.log("File does not exist");
			return false;
		}
		console.log("Error: ", e);
		return false;
	}
}

/**
 * Have you installed deno?
 * @return {boolean} true if deno is installed, false otherwise
 */
export function checkDenoInstalled(): boolean {
  return $.commandExistsSync("deno");
}

/**
 * When project name is empty, call this function.
 */
export async function setProjectName(): Promise<string> {
  return await $.prompt({
    message: "What's your HonoX project name?",
    default: "myProject", // prefilled value
    noClear: true, // don't clear the text on result
  });
}

/**
 * Aaks the user for overwrite confirmation.
 * @return {boolean} true if the user wants to overwrite, false otherwise.
 */
export async function askOverwrite(): Promise<boolean> {
  return await $.confirm({
    message: "Do you want to overwrite?",
    default: false,
  });
}