import { LOCALIZATION_MODULE_COLOR_SCHEME } from "../Localization/LOCALIZATION_MODULE.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT, COLOR_SCHEME_SYSTEM } from "./COLOR_SCHEME.mjs";

/** @typedef {import("./ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("./SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

/**
 * @type {ColorScheme[]}
 */
export const DEFAULT_COLOR_SCHEMES = Object.freeze([
    {
        getLabel: async localization => localization.translate(
            "System based",
            LOCALIZATION_MODULE_COLOR_SCHEME
        ),
        name: COLOR_SCHEME_SYSTEM
    },
    {
        getLabel: async localization => localization.translate(
            "Light",
            LOCALIZATION_MODULE_COLOR_SCHEME
        ),
        name: COLOR_SCHEME_LIGHT
    },
    {
        getLabel: async localization => localization.translate(
            "Dark",
            LOCALIZATION_MODULE_COLOR_SCHEME
        ),
        name: COLOR_SCHEME_DARK
    }
].map(color_scheme => Object.freeze(color_scheme)));

/**
 * @type {SystemColorScheme[]}
 */
export const DEFAULT_SYSTEM_COLOR_SCHEMES = Object.freeze([
    {
        "default-color-scheme": COLOR_SCHEME_LIGHT,
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_LIGHT})`),
        getLabel: async localization => localization.translate(
            "Light",
            LOCALIZATION_MODULE_COLOR_SCHEME
        ),
        name: COLOR_SCHEME_LIGHT,
        "use-in-color-scheme": true
    },
    {
        "default-color-scheme": COLOR_SCHEME_DARK,
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_DARK})`),
        getLabel: async localization => localization.translate(
            "Dark",
            LOCALIZATION_MODULE_COLOR_SCHEME
        ),
        name: COLOR_SCHEME_DARK,
        "use-in-color-scheme": true
    }
].map(system_color_scheme => Object.freeze(system_color_scheme)));
