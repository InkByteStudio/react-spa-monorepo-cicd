import { z } from "zod/v4";

/**
 * Schema for environment variables shared across SPA apps.
 * Validates VITE_* variables at build time to catch misconfigurations early.
 */
export const spaEnvSchema = z.object({
  VITE_API_BASE_URL: z.url("VITE_API_BASE_URL must be a valid URL"),
});

export type SpaEnv = z.infer<typeof spaEnvSchema>;

/**
 * Validates environment variables against the schema.
 * Call this in vite.config.ts to catch misconfigurations early.
 *
 * In CI, env vars are injected from secrets and validation errors fail the build.
 * Locally, missing env files produce a warning instead of a hard failure.
 *
 * @param env - The environment variables to validate (e.g., from Vite's loadEnv)
 */
export function validateEnv(env: Record<string, string>): SpaEnv | null {
  const result = spaEnvSchema.safeParse(env);
  if (result.success) {
    return result.data;
  }
  if (process.env.CI) {
    throw new Error(
      `Environment validation failed:\n${result.error.issues.map((i) => `  - ${i.message}`).join("\n")}`,
    );
  }
  console.warn(
    "[env] Missing or invalid environment variables (build will use defaults):",
    result.error.issues.map((i) => i.message).join(", "),
  );
  return null;
}
