// https://github.com/andreashuber69/eslint-config/blob/master/README.md#----andreashuber69eslint-config

import { rules } from "eslint-plugin-react-hooks";
import { getSeverities } from "./getSeverities.js";

export const allReactHooksRules = getSeverities(rules, "react-hooks");
