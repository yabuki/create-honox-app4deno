/**
 * Deno Vite config for HonoX Vanilla.
 */
import build from "@hono/vite-build/deno";
import honox from "honox/vite";
import adapter from "@hono/vite-dev-server/node";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    honox({
      devServer: { adapter },
      client: { input: ["./app/style.css"] },
    }),
    build(),
  ],
});
