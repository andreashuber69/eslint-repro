// https://github.com/andreashuber69/eslint-config/blob/master/README.md#----andreashuber69eslint-config

import { getRules } from "./getRules.js";
import { getSeverities } from "./getSeverities.js";

export const getRuleSeverities = async (config?: unknown[]) =>
    // eslint-disable-next-line no-warning-comments
    // TODO: Possibly superfluous?
    Object.fromEntries(Object.entries(getSeverities(await getRules(config))));
