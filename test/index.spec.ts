// https://github.com/andreashuber69/eslint-config/blob/master/README.md#----andreashuber69eslint-config

import assert from "node:assert";
import { describe, it } from "node:test";

import unicorn from "eslint-plugin-unicorn";

import { getRuleSeverities } from "./getRuleSeverities.js";

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
