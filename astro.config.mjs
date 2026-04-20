import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://dbprod-factory.pages.dev",
  integrations: [react(), mdx()],
  output: "static",
  vite: {
    ssr: {
      noExternal: ["framer-motion"],
    },
  },
});
