import type { Linter } from "eslint";
import { ESLint } from "eslint";

import unicorn from "eslint-plugin-unicorn";
import { languageOptions } from "./languageOptions.js";

const getRuleNames = async (config?: unknown[]) => {
    const options: ESLint.Options = {
        overrideConfig: [
            // There's no other way
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            ...((config ?? []) as Linter.Config[]),
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


for (const key of await getRuleNames([unicorn.configs["flat/all"]])) {
    if (key.startsWith("@stylistic")) {
        console.log(key);
    }
}
