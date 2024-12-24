import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export const languageOptions = {
    globals: {
        ...globals.node,
    },
    parser: tsParser,
    parserOptions: {
        projectService: {
            allowDefaultProject: ["eslint.config.js"],
            defaultProject: "./tsconfig.json",
        },
        tsconfigRootDir: process.cwd(),
    },
};
