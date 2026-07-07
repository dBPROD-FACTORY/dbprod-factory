import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://dbprod-factory.pages.dev",
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/upload"),
    }),
  ],
  output: "static",
  vite: {
    ssr: {
      noExternal: ["framer-motion"],
    },
  },
});
