import { languageOptions } from "./languageOptions.js";

const config = [
    {
        files: ["**/*.ts", "**/*.js"],
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
