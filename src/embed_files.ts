/**
 * @file embed_files.ts
 * @fileoverview
 * @description このスクリプトは直接実行した場合は template.tar.gz を base64 文字列として埋め込みます。
 * @license Apache-2.0
 * @author Yukiharu YABUKI <yabuki@netfort.gr.jp>
 * see LICENSE for details.
 */

//
import { decodeBase64, encodeBase64 } from "@std/encoding";

/**
 * @description base64 文字列をデコードしてファイルに書き込む
 * @param {string} fileNameWithPath - 書き込むファイルのパスとファイル名
 * @param {string} base64Content - base64 文字列
 */
export function writeEmbbedfile(
	fileNameWithPath: string,
	base64Content: string,
): void {
	const decodedContent = decodeBase64(base64Content);
	console.log(`Writing file to ${fileNameWithPath}`);
	Deno.writeFileSync(fileNameWithPath, decodedContent, {
		createNew: true,
		append: false,
	});
}

// このファイルが直接実行された時にのみ処理を行う。import された場合は実行しない。
if (import.meta.main) {
	const templatePathAndFile: string = "./template.tar.gz"; // srcにいるので ./template.tar.gz
	// template.tar.gz のパスを指定

	// ファイルを読み込み、base64 にエンコード
	const fileContent = Deno.readFileSync(templatePathAndFile);
	const base64Content = encodeBase64(fileContent);

	// projectのカレントから見ると、出力先は ./src/embbedFiles.ts になる。
	// TypeScript ファイルとして出力
	const outputFile = "./src/embeddedFiles.ts";
	const outputContent = `// embeddedFiles.ts
// template.tar.gz を base64 文字列として埋め込んだファイル
// This file is automatically generated by embed_files.ts.
// Do not edit manually.

export const embeddedFile = "${base64Content}";
`;

	Deno.writeTextFileSync(outputFile, outputContent, {
		append: false,
	});
	console.log(`embeddedFiles.ts を生成しました: ${outputFile}`);
}
