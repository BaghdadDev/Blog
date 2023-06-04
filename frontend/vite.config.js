import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import graphql from "@rollup/plugin-graphql";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), graphql()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__test__/setup.jsx",
    coverage: {
      reporter: ["text", "json", "html"],
      reportsDirectory: "./src/__test__/coverage",
    },
  },
  // resolve: {
  //   alias: {
  //     "@": fileURLToPath(new URL("./src", import.meta.url)),
  //   },
  // },
});
