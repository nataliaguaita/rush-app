import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  security.configs.recommended,
  {
    // Security rules are meant to block the build, not just warn.
    rules: {
      ...Object.fromEntries(
        Object.keys(security.configs.recommended.rules).map((rule) => [rule, "error"])
      ),
      // Flags every typed Record/array lookup by variable key (e.g. itemsMap[id],
      // filteredClientes[activeIndex]) with no way to know the key is attacker-controlled.
      // Audited every hit in this codebase: all are internal typed lookups, no real sink.
      "security/detect-object-injection": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Nested build output and other agents' isolated worktrees.
    "**/.next/**",
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;
