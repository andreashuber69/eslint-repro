import { languageOptions } from "./languageOptions.js";

const config = [
    {
        files: ["**/*.ts", "**/*.js"],
    },
    {
        ignores: ["coverage/"],
    },
    {
        rules: {
            eqeqeq: "error",
        },
    },
    {
        languageOptions,
    }
];

export default config;
