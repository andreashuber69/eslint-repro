// https://github.com/andreashuber69/eslint-config/blob/master/README.md#----andreashuber69eslint-config

import promise from "eslint-plugin-promise";
import { getSeverities } from "./getSeverities.js";

export const allPromiseRules = getSeverities(promise.rules, "promise");
