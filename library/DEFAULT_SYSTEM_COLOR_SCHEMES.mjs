import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT } from "./COLOR_SCHEME.mjs";
import { LOCALIZATION_KEY_DARK, LOCALIZATION_KEY_LIGHT } from "./Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("./SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

/**
 * @type {SystemColorScheme[]}
 */
export const DEFAULT_SYSTEM_COLOR_SCHEMES = Object.freeze([
    Object.freeze({
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_DARK})`),
        label: async localization => localization.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_DARK
        ),
        name: COLOR_SCHEME_DARK
    }),
    Object.freeze({
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_LIGHT})`),
        label: async localization => localization.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_LIGHT
        ),
        name: COLOR_SCHEME_LIGHT
    })
]);
