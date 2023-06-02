import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import graphql from "@rollup/plugin-graphql";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), graphql()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__test__/setup.jsx",
  },
  resolve: {
    // alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
  },
  base: "/",
});
