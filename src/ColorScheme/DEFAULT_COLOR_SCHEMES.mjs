import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT, COLOR_SCHEME_SYSTEM } from "./COLOR_SCHEME.mjs";

/** @typedef {import("./ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("./SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

/**
 * @type {ColorScheme[]}}
 */
export const DEFAULT_COLOR_SCHEMES = Object.freeze([
    {
        label: "System based",
        name: COLOR_SCHEME_SYSTEM
    },
    {
        "color-scheme": COLOR_SCHEME_LIGHT,
        label: "Light",
        name: COLOR_SCHEME_LIGHT
    },
    {
        "color-scheme": COLOR_SCHEME_DARK,
        label: "Dark",
        name: COLOR_SCHEME_DARK
    }
]);

/**
 * @type {SystemColorScheme[]}}
 */
export const DEFAULT_SYSTEM_COLOR_SCHEMES = Object.freeze([
    {
        "default-color-scheme": COLOR_SCHEME_LIGHT,
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_LIGHT})`),
        label: "Light",
        name: COLOR_SCHEME_LIGHT,
        "use-in-color-scheme": true
    },
    {
        "default-color-scheme": COLOR_SCHEME_DARK,
        detector: matchMedia(`(prefers-color-scheme: ${COLOR_SCHEME_DARK})`),
        label: "Dark",
        name: COLOR_SCHEME_DARK,
        "use-in-color-scheme": true
    }
]);
