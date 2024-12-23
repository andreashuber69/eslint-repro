import type { Linter } from "eslint";
import { ESLint } from "eslint";

import unicorn from "eslint-plugin-unicorn";
import { languageOptions } from "./languageOptions.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const getRules = async (config?: unknown[]): Promise<Record<string, unknown>> => {
    const options: ESLint.Options = {
        baseConfig: [
            // There's no other way
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            ...((config ?? []) as Linter.Config[]),
            { languageOptions },
        ],
    };

    const eslint = new ESLint(config ? options : undefined);
    const fullConfig = (await eslint.calculateConfigForFile("index.js")) as unknown;

    if (fullConfig && typeof fullConfig === "object" && "rules" in fullConfig) {
        const { rules } = fullConfig;

        if (isRecord(rules)) {
            return rules;
        }
    }

    throw new Error("Unexpected config!");
};

const getRuleNames = (rules: unknown, prefix = "") => {
    const result = new Array<string>();

    if (rules && typeof rules === "object") {
        for (const key of Object.keys(rules)) {
            result.push(`${prefix}${prefix && "/"}${key}`);
        }
    }

    return result;
};

for (const key of getRuleNames(await getRules([unicorn.configs["flat/all"]]))) {
    if (key.startsWith("@stylistic")) {
        console.log(key);
    }
}
