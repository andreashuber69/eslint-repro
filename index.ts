import type { Linter } from "eslint";
import { ESLint } from "eslint";

import { languageOptions } from "./languageOptions.js";

const getRuleNames = async (options?: ESLint.Options) => {
    const eslint = new ESLint(options);
    const fullConfig = (await eslint.calculateConfigForFile("index.ts")) as unknown;

    if (fullConfig && typeof fullConfig === "object" && "rules" in fullConfig) {
        const { rules } = fullConfig;
        const result = new Array<string>();

        if (rules) {
            for (const key of Object.keys(rules)) {
                result.push(key);
            }
        }

        return result;
    }

    throw new Error("Unexpected config!");
};

const options: ESLint.Options = {
    overrideConfigFile: true,
    overrideConfig: [
        {
            files: ["**/*.ts", "**/*.js"],
        },
        {
            rules: {
                camelcase: "error",
            },
        },
        { languageOptions },
    ],
};


for (const key of await getRuleNames(options)) {
    console.log(key);
}
