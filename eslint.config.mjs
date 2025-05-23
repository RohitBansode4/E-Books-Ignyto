import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add your custom rules here
  {
    rules: {
      "react/no-unescaped-entities": "off", // disable this rule globally
      // Or set it to warning:
      // "react/no-unescaped-entities": "warn",
      // Or error:
      // "react/no-unescaped-entities": "error",
    },
  },
];

export default eslintConfig;