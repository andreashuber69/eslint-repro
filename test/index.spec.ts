import type { Linter } from "eslint";
import { ESLint } from "eslint";

import unicorn from "eslint-plugin-unicorn";
import { languageOptions } from "../languageOptions.js";

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

const getRuleLevel = (entry: unknown): unknown => {
    // Exhaustiveness does not make much sense here since we're only interested in number, string and Array
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (typeof entry) {
        case "number":
        case "string":
            return entry;
        default:
            return Array.isArray(entry) && entry.length > 0 ? entry[0] : "error";
    }
};

const getSeverityString = (entry: unknown): unknown => {
    const ruleLevel = getRuleLevel(entry);

    switch (ruleLevel) {
        case 0:
            return "off";
        case 1:
            return "warn";
        case 2:
            return "error";
        default:
            return ruleLevel;
    }
};

const getSeverities = (rules: unknown, prefix = "") => {
    const result: Record<string, unknown> = {};

    if (rules && typeof rules === "object") {
        for (const [id, value] of Object.entries(rules)) {
            result[`${prefix}${prefix && "/"}${id}`] = getSeverityString(value);
        }
    }

    return result;
};

const getRuleSeverities = async (config?: unknown[]) =>
    // eslint-disable-next-line no-warning-comments
    // TODO: Possibly superfluous?
    Object.fromEntries(Object.entries(getSeverities(await getRules(config))));

const allConfigsRules = await getRuleSeverities([unicorn.configs["flat/all"]]);

for (const key of Object.keys(allConfigsRules)) {
    if (key.startsWith("@stylistic")) {
        console.log(key);
    }
}
