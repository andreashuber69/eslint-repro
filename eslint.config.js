import generalConfig from "./index.js";

const config = [
    {
        files: ["**/*.ts"],
    },
    {
        ignores: ["coverage/"],
    },
    ...generalConfig,
];

// eslint-disable-next-line import/no-default-export
export default config;
