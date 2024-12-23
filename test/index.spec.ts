// https://github.com/andreashuber69/eslint-config/blob/master/README.md#----andreashuber69eslint-config

import assert from "node:assert";
import { describe, it } from "node:test";

import unicorn from "eslint-plugin-unicorn";

import type { Linter } from "eslint";
import { ESLint } from "eslint";
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

const getAllConfigsRules = async () => await getRuleSeverities([unicorn.configs["flat/all"]]);

// eslint-disable-next-line promise/always-return
getAllConfigsRules().then(async (allConfigsRules) => {
    await describe("index.js", async () => {
        // According to https://eslint.style/guide/config-presets#enable-all-available-rules,
        // plugin:@stylistic/all-extends deliberately does not include JSX and non-fixable rules, we therefore need to
        // test these differently.
        const jsxAndNonFixableStylisticRuleIds = [
            "@stylistic/jsx-child-element-spacing",
            "@stylistic/jsx-closing-bracket-location",
            "@stylistic/jsx-closing-tag-location",
            "@stylistic/jsx-curly-brace-presence",
            "@stylistic/jsx-curly-newline",
            "@stylistic/jsx-curly-spacing",
            "@stylistic/jsx-equals-spacing",
            "@stylistic/jsx-first-prop-new-line",
            "@stylistic/jsx-indent",
            "@stylistic/jsx-indent-props",
            "@stylistic/jsx-max-props-per-line",
            "@stylistic/jsx-newline",
            "@stylistic/jsx-one-expression-per-line",
            "@stylistic/jsx-pascal-case",
            "@stylistic/jsx-props-no-multi-spaces",
            "@stylistic/jsx-self-closing-comp",
            "@stylistic/jsx-sort-props",
            "@stylistic/jsx-tag-spacing",
            "@stylistic/jsx-wrap-multilines",
            "@stylistic/max-len",
            "@stylistic/max-statements-per-line",
            "@stylistic/no-mixed-operators",
            "@stylistic/no-mixed-spaces-and-tabs",
            "@stylistic/no-tabs",
        ];

        await describe("should list all non-fixable stylistic rules", async () => {
            for (const id of jsxAndNonFixableStylisticRuleIds) {
                // eslint-disable-next-line no-await-in-loop
                await it(id, () => {
                    assert(!allConfigsRules[id], `${id} is unexpectedly in the list of extended from rules.`);
                });
            }
        });
    });
// eslint-disable-next-line unicorn/prefer-top-level-await
}).catch((error: unknown) => console.error(error));
