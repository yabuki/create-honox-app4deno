# create-honox-app4deno

Set up a modern HonoX web app for Deno by running one command.

Japanse Document.
- [README-ja](./README-ja.md)

## What is this program?

Set up a modern HonoX web app.

1. Clone the repositry
2. Build: Run the following command `deno task build`
3. Create Project: `./create-honox-app4deno "projectName"` if you want to add path like "/tmp/projectName". 
4. Navigate to the directory. `cd "projectName"`
5. Start Development server. `deno task dev`

You've done. Now you can see that HonoX works

Yes. This program gives you minimal environemnt. You can add a other framework like react, svelte and so on.

## How to build

You need to prepare tar command. I recommend you develop on Unix like environment. On Linux/WSL and so on.

1. Install Deno.
2. Set up develop environment. (prepare tar command)
3. Clone this repositry.
4. `deno task build`

That's all. Enjoy!

## Technical references

### Deno

- [Deno Documentation](https://docs.deno.com/)
- [@david/dax - JSR](https://jsr.io/@david/dax)
  - You need to use 0.43.0 or later. see [Compiled scripts cannot spawn `deno` · Issue #297 · dsherret/dax](https://github.com/dsherret/dax/issues/297)
  - [dsherret/dax: Cross-platform shell tools for Deno and Node.js inspired by zx.](https://github.com/dsherret/dax)

### Hono and HonoX

- [honojs/hono: Web framework built on Web Standards](https://github.com/honojs/hono)

- [honojs/honox: HonoX - Hono based meta framework](https://github.com/honojs/honox)
- [yusukebe/honox-examples: HonoX examples](https://github.com/yusukebe/honox-examples)

- [honojs/middleware: monorepo for Hono third-party middleware/helpers/wrappers](https://github.com/honojs/middleware)

### Vite

- [Vite | Next Generation Frontend Tooling](https://vite.dev/)

<!-- Cspell:ignore honox -->
