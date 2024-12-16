// https://github.com/andreashuber69/eslint-config/blob/master/README.md#----andreashuber69eslint-config

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

export const getSeverities = (rules: unknown, prefix = "") => {
    const result: Record<string, unknown> = {};

    if (rules && typeof rules === "object") {
        for (const [id, value] of Object.entries(rules)) {
            result[`${prefix}${prefix && "/"}${id}`] = getSeverityString(value);
        }
    }

    return result;
};
