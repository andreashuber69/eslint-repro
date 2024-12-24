import type { Linter } from "eslint";
import { ESLint } from "eslint";

import { languageOptions } from "./languageOptions.js";

const getRuleNames = async (config?: Linter.Config[]) => {
    const options: ESLint.Options = {
        overrideConfig: [
            ...(config ?? []),
            { languageOptions },
        ],
    };

    const eslint = new ESLint(config ? options : undefined);
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

const myConfig: Linter.Config[] = [
    {
        rules: {
            camelcase: "error",
        },
    },
];

for (const key of await getRuleNames(myConfig)) {
    console.log(key);
}
