/**
 * @description
 * @license Apache-2.0
 * @author Yukiharu YABUKI <yabuki@netfort.gr.jp>
 * see LICENSE for details.
 */
import $ from "@david/dax";
import { assert } from "@std/assert/assert";

/***
 */
export async function createNewDirectory(
	src: string,
	dest: string,
): Promise<boolean> {
	if (isDircectoryExists(dest)) {
		$.logWarn("Directory or file already exists");
		return false;
	}
	$.log("Creating directory: ", dest);
	await copyDirectory(src, dest);
	return true;
}
/**
 * @description 指定のディレクトリをコピーする。
 * @param src
 * @param dest
 * @returns {Promise<void>}
 */
async function copyDirectory(src: string, dest: string): Promise<void> {
	await $`cp -r ${src} ${dest}`;
}

/**
 * @description 指定のディレクトリを削除する。
 * @param targetDir
 * @returns {Promise<boolean>}
 */
export async function removeDirectory(
	targetDir: string,
): Promise<boolean> {
	$.log("Removing directory: ", targetDir);
	try {
		await $`rm -rf ${targetDir}`;
	} catch (e) {
		$.logError("Error: ", e);
		return false;
	}
	return true;
}

/**
 * 引数のパスとファイル名の組み合わせでディレクトリが作成
 * 可能かどうかを調べる。
 * すでに同名のファイル、ディレクトリ、シンボリックリンク
 * が存在する時は、trueを返す。何もないときだけfalseを返す。
 * @param targetDir
 * @returns
 */
export function isDircectoryExists(targetDir: string): boolean {
	try {
		const file_info = Deno.statSync(targetDir);
		if (file_info.isFile) {
			$.logWarn("File exists");
			return true;
		}
		if (file_info.isSymlink) {
			$.logWarn("Symlink exists");
			return true;
		}
		if (file_info.isDirectory) {
			$.logWarn("Directory exists");
			return true;
		}
		assert(false, "Unknown file type");
		return false;
	} catch (e) {
		if (e instanceof Deno.errors.NotFound) {
			$.log("OK. File does not exist");
			return false;
		}
		$.logError("Error: ", e);
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

/***
 * Install npm modules.
 * @param targetDir
 */
export async function installNpmModules(
	targetDir: string,
): Promise<void> {
	// Move to the directory
	// await $`cd ${path_and_filename}`;
	//await $.cd(targetDir);
	$.log(Deno.cwd());
	$.log(`Installing npm modules in ${targetDir}`);
  // package.jsonがあるので --dev付きでインストールしておく。
	await $`deno add npm:hono@latest`.cwd(targetDir);
	await $`deno add npm:honox@latest`.cwd(targetDir);
	await $`deno add npm:vite@latest`.cwd(targetDir);
	await $`deno add npm:@hono/vite-build/deno --dev`.cwd(targetDir);
	await $`deno add npm:@hono/vite-dev-server/deno --dev`.cwd(targetDir);
}
