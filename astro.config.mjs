import { defineConfig } from "astro/config";
import postcssMergeQueries from "postcss-merge-queries";
import htmlMinify from "@frontendista/astro-html-minify";
import glsl from "vite-plugin-glsl";
import sitemap from "@astrojs/sitemap";
import * as dotenv from "dotenv";
dotenv.config();

function createDate() {
  const now = new Date(),
    year = now.getFullYear(),
    month = now.getMonth() + 1,
    date = now.getDate(),
    hour = now.getHours(),
    minute = now.getMinutes();
  return `${year}${month}${date}${hour}${minute}`;
  // return `${year}${month}${date}`;
}

const DATE = createDate(),
  MODE = process.env.NODE_ENV,
  SITE_URL = MODE === "production" ? process.env.PUBLIC_PROD_URL : process.env.PUBLIC_LOCAL_URL;
// ? process.env.PUBLIC_TEST_URL : process.env.PUBLIC_LOCAL_URL;
// ? process.env.PUBLIC_LOCAL_URL : process.env.PUBLIC_LOCAL_URL;

console.log(
  `// --------------------------\n\n⚡️ ~ MODE : ${MODE}\n\n▕▔▔▔▔▔▔▔▔▔▔▔╲\n▕╮╭┻┻╮╭┻┻╮╭▕╮╲\n▕╯┃╭╮┃┃╭╮┃╰▕╯╭▏\n▕╭┻┻┻┛┗┻┻┛ ╰▏ ▏\n▕╰━━━┓┈┈┈╭╮▕╭╮▏\n▕╭╮╰┳┳┳┳╯╰╯▕╰╯▏\n▕╰╯┈┗┛┗┛┈╭╮▕╮┈▏\n\n// --------------------------`,
);

console.log(SITE_URL);

// https://astro.build/config
export default defineConfig({
  markdown: {
    drafts: true,
  },
  build: {
    assets: "assets",
  },
  site: SITE_URL,
  base: "/",
  vite: {
    plugins: [glsl()],
    esbuild: {
      drop: ["console", "debugger"],
    },
    build: {
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 100000000,
      rollupOptions: {
        output: {
          assetFileNames: `assets/[ext]/[name].${DATE}[extname]`,
          entryFileNames: `assets/js/build.${DATE}.js`,
        },
      },
      cssCodeSplit: false,
    },
    css: {
      postcss: {
        plugins: [postcssMergeQueries],
      },
    },
    server: {
      open: true,
      port: 8080,
    },
    preview: {
      open: true,
      port: 8080,
    },
  },
  integrations: [
    sitemap(),
    htmlMinify({
      reportCompressedSize: false,
      htmlTerserMinifierOptions: {
        removeComments: true,
        removeTagWhitespace: false,
      },
    }),
  ],
  server: {
    open: true,
    host: true,
    port: 3000,
  },
  preview: {
    open: true,
    host: true,
    port: 3000,
  },
});
