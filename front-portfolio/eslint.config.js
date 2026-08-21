// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // Convention : un identifiant préfixé `_` est volontairement inutilisé
      // (signature imposée, ex. middleware d'erreur Express à 4 arguments).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Garde-fou de taille (cf. docs/architecture-report.md) — warn, pas error.
      "max-lines": [
        "warn",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    // Data déclaratives et catalogues d'images : la longueur est le contrat.
    files: ["**/*.data.ts", "**/*.state.ts", "**/*.source.ts", "**/*.sources.ts"],
    rules: {
      "max-lines": "off",
    },
  },
  {
    // Specs : stubs vides et doubles typés `any` sont idiomatiques en test.
    files: ["**/*.spec.ts"],
    rules: {
      "max-lines": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
