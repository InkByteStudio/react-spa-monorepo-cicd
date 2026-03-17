import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { validateEnv } from "@repo/shared-utils";

export default defineConfig(({ mode }) => {
  if (mode !== "development") {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    validateEnv(env);
  }

  return {
    base: "/admin/",
    plugins: [react()],
  };
});
