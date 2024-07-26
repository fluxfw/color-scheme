import { LOCALIZATION_MODULE_COLOR_SCHEME } from "./Localization/LOCALIZATION_MODULE_COLOR_SCHEME.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT } from "./COLOR_SCHEME.mjs";
import { LOCALIZATION_KEY_COLOR_SCHEME_DARK, LOCALIZATION_KEY_COLOR_SCHEME_LIGHT } from "./Localization/LOCALIZATION_KEY_COLOR_SCHEME.mjs";

/** @typedef {import("./SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

/**
 * @type {SystemColorScheme[]}
 */
export const DEFAULT_SYSTEM_COLOR_SCHEMES = Object.freeze([
    Object.freeze({
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_DARK})`),
        label: async localization => localization.translate(
            LOCALIZATION_MODULE_COLOR_SCHEME,
            LOCALIZATION_KEY_COLOR_SCHEME_DARK
        ),
        name: COLOR_SCHEME_DARK
    }),
    Object.freeze({
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_LIGHT})`),
        label: async localization => localization.translate(
            LOCALIZATION_MODULE_COLOR_SCHEME,
            LOCALIZATION_KEY_COLOR_SCHEME_LIGHT
        ),
        name: COLOR_SCHEME_LIGHT
    })
]);
