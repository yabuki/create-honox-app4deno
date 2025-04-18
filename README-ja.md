# create-honox-app4deno

Set up a modern HonoX web app for Deno by running one command.

## このプログラムは何か?

HonoXをDenoで使うに当たって環境設定を行うプログラムです。
最初はできるだけ依存関係を減らした環境設定を目指します。

可能な限り、Denoで提供されているlinter,formatter,unittestを使う。

このプログラムを実行すると、最小限の雛形としてDenoとHonoXが動くようにする。

## ディレクトリ構成

```
ProjectRoot
+ src ソースファイル
+ template テンプレート
 + app
 + public
+ tests ユニットテスト
```

## 参考にした。またはしたい。repo

- [4513ECHO/etude-honox-deno: An example of using HonoX with Deno](https://github.com/4513ECHO/etude-honox-deno)

Cspell:ignore honox
