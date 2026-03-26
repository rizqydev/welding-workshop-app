import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  // Top-level ignores (works correctly in flat config)
  {
    ignores: ["node_modules/", ".next/", "dist/"],
  },

  // Next.js recommended rules
  ...compat.extends("next/core-web-vitals"),

  // Disables ESLint rules that conflict with Prettier
  prettierConfig,

  // Prettier as an ESLint rule
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",
    },
  },
]

export default eslintConfig
