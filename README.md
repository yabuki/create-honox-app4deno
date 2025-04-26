# create-honox-app4deno

Set up a modern HonoX web app for Deno by running one command.

Japanse Document.
- [README-ja](./README-ja.md)

## What is this program?

Set up a modern HonoX web app.

1. clone
2. build
3. `./create-honox-app4deno "projectName"`
4. `cd "projectName"`
5. `deno task dev`

You've done.

Yes. This is minimal environemnt. You can add a other framework like react, svalte and so on.

## How to build

You need to prepare tar command. I recommend you develop on Unix like environment. On Linux/WSL and so on.

1. Install Deno.
2. Set up develop environment. (prepare tar command)
3. Clone this repositry.
4. `deno task build`

That's all. Enjoy!

## Technical references

- [Deno Documentation](https://docs.deno.com/)
- [@david/dax - JSR](https://jsr.io/@david/dax)
  - You need to use 0.43.0 or later. see [Compiled scripts cannot spawn `deno` · Issue #297 · dsherret/dax](https://github.com/dsherret/dax/issues/297)
  - [dsherret/dax: Cross-platform shell tools for Deno and Node.js inspired by zx.](https://github.com/dsherret/dax)

<!-- Cspell:ignore honox -->
