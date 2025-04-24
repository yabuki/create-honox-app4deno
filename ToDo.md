# HonoX 雛形作成 ToDo リスト

1. [x] プロジェクトディレクトリの作成
2. [x] Deno環境のセットアップ
3. HonoXのインストール
4. 必要な依存関係の追加
5. ベースとなるディレクトリ構造の作成
6. サンプルルートの実装
7. 動作確認用のテストコード作成
8. ローカル環境での動作確認
9. [x] README.mdの作成
10. [x] Gitリポジトリの初期化と初回コミット
11. 必要に応じてCI/CDの設定
12. プロジェクトの公開準備

## 直近

- [x] deno init
- [x] deno.jsoncを作る
  - [x] 初期のlintの設定
- [x] 一発めの`deno task test`を実行して、passした。
- [x] daxを使って楽をする。
- [x] ./template/に初期コードをぶっこむ。
  - [ ] template配下に必要な設定ファイルを作る
  - [ ] daxでdeno add hono honox viteを追加する。

## Portable File Tree

- 指定のディレクトリを圧縮して、単一ファイルにするプログラム
- それに対応してmktempなディレクトリに展開してdaxで使えるpathを返す。
- clean upもいるね。
- Etude-denoでPoC作るか。

## テスト駆動用の作りたい機能リスト

- [ ] daxの結果をどうテストするか。自明な気もするが。
- [ ] 基本に戻って、外部から観察できる部分に切り出す。

## 将来

- [ ] `deno init --npm honox-app4deno` で導入できるようにしたい。
  - [ ] Denoでnpmパッケージを作る方法を学ぶ必要がある。
- [ ] Reactなどのテンプレート導入に関しては、依存関係を増やすため、最小限の実装ができてからやることを検討する。
- [ ] これは、ちゃんと動くかわかるまで延期する。templateに、tsconfig.jsonに対応する、deno.jsonを作る

Cspell:ignore honox
