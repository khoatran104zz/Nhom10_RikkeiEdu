import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      boundaries,
      "unused-imports": unusedImports,
    },
    settings: {
      "boundaries/elements": [
        {
          type: "app",
          pattern: "src/app/**",
        },
        {
          type: "ui",
          pattern: "src/components/ui/**",
        },
        {
          type: "base",
          pattern: "src/components/base/**",
        },
        {
          type: "features",
          pattern: "src/components/features/**",
        },
        {
          type: "lib",
          pattern: "src/lib/**",
        },
        {
          type: "hooks",
          pattern: "src/hooks/**",
        },
        {
          type: "store",
          pattern: "src/store/**",
        },
        {
          type: "providers",
          pattern: "src/providers/**",
        },
        {
          type: "services",
          pattern: "src/services/**",
        },
        {
          type: "schemas",
          pattern: "src/schemas/**",
        },
        {
          type: "types",
          pattern: "src/types/**",
        },
        {
          type: "utils",
          pattern: "src/utils/**",
        },
        {
          type: "constants",
          pattern: "src/constants/**",
        },
      ],
    },
    rules: {
      // 0. Disable custom hook state rules that cause false positives on simple useEffects
      "react-hooks/set-state-in-effect": "off",

      // 1. Unused imports
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // 2. No any
      "@typescript-eslint/no-explicit-any": "error",

      // 3. No magic numbers (warning)
      "@typescript-eslint/no-magic-numbers": [
        "warn",
        {
          ignore: [0, 1, -1, 2, 100, 1000],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
        },
      ],

      // 4. Folder boundaries
      "boundaries/entry-point": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              target: ["app", "features", "base", "ui", "lib", "hooks", "store", "providers", "services", "schemas", "types", "utils", "constants"],
              allow: "**",
            },
          ],
        },
      ],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "ui",
              allow: ["types", "constants", "lib"],
            },
            {
              from: "base",
              allow: ["ui", "types", "constants", "utils", "store", "hooks"],
            },
            {
              from: "features",
              allow: ["ui", "base", "lib", "hooks", "store", "providers", "services", "schemas", "types", "utils", "constants"],
            },
            {
              from: "services",
              allow: ["lib", "types", "constants"],
            },
            {
              from: "store",
              allow: ["types", "constants", "lib"],
            },
            {
              from: "providers",
              allow: ["types", "constants", "store", "services"],
            },
            {
              from: "types",
              allow: ["constants"],
            },
            {
              from: "app",
              allow: ["ui", "base", "features", "lib", "hooks", "store", "providers", "services", "schemas", "types", "utils", "constants"],
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
