import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export const languageOptions = {
    globals: {
        ...globals.node,
    },
    parser: tsParser,
    parserOptions: {
        // As of typescript-eslint v8.18.0, it is not entirely clear how projectService should be configured.
        // Many examples specify allowDefaultProject: ["*.js"], but that does not work here.
        projectService: {
            allowDefaultProject: ["eslint.config.js"],
            defaultProject: "./tsconfig.json",
        },
        tsconfigRootDir: process.cwd(),
    },
};
