import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT, COLOR_SCHEME_SYSTEM } from "./COLOR_SCHEME.mjs";
import { LOCALIZATION_KEY_DARK, LOCALIZATION_KEY_LIGHT, LOCALIZATION_KEY_SYSTEM_BASED } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("./ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("./SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

/**
 * @type {ColorScheme[]}
 */
export const DEFAULT_COLOR_SCHEMES = Object.freeze([
    Object.freeze({
        label: async localization => localization.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_SYSTEM_BASED
        ),
        name: COLOR_SCHEME_SYSTEM
    }),
    Object.freeze({
        label: async localization => localization.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_LIGHT
        ),
        name: COLOR_SCHEME_LIGHT
    }),
    Object.freeze({
        label: async localization => localization.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_DARK
        ),
        name: COLOR_SCHEME_DARK
    })
]);

/**
 * @type {SystemColorScheme[]}
 */
export const DEFAULT_SYSTEM_COLOR_SCHEMES = Object.freeze([
    Object.freeze({
        "default-color-scheme": COLOR_SCHEME_LIGHT,
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_LIGHT})`),
        label: async localization => localization.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_LIGHT
        ),
        name: COLOR_SCHEME_LIGHT,
        "use-in-color-scheme": true
    }),
    Object.freeze({
        "default-color-scheme": COLOR_SCHEME_DARK,
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_DARK})`),
        label: async localization => localization.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_DARK
        ),
        name: COLOR_SCHEME_DARK,
        "use-in-color-scheme": true
    })
]);
