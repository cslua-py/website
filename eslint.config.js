import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    settings: { react: { version: "detect" } },
    rules: {
      // Props are not validated with PropTypes in this project.
      "react/prop-types": "off",
    },
  },
  {
    // Config files and scripts run in Node, not in the browser.
    files: ["eslint.config.js", "vite.config.js", "scripts/**/*.js"],
    languageOptions: { globals: globals.node },
  },
];
