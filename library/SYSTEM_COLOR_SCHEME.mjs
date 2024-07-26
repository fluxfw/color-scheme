import { LOCALIZATION_MODULE_COLOR_SCHEME } from "./Localization/LOCALIZATION_MODULE_COLOR_SCHEME.mjs";
import { LOCALIZATION_KEY_COLOR_SCHEME_SYSTEM, LOCALIZATION_KEY_COLOR_SCHEME_SYSTEM_WITH_COLOR_SCHEME } from "./Localization/LOCALIZATION_KEY_COLOR_SCHEME.mjs";

/** @typedef {import("./ColorSchemeObject.mjs").ColorSchemeObject} ColorSchemeObject */

export const COLOR_SCHEME_SYSTEM = "system";

/**
 * @type {ColorSchemeObject}
 */
export const SYSTEM_COLOR_SCHEME = Object.freeze({
    label: async (localization = null, system_label = null) => (system_label !== null ? localization?.translate(
        LOCALIZATION_MODULE_COLOR_SCHEME,
        LOCALIZATION_KEY_COLOR_SCHEME_SYSTEM_WITH_COLOR_SCHEME,
        {
            "color-scheme": system_label
        }
    ) : localization?.translate(
        LOCALIZATION_MODULE_COLOR_SCHEME,
        LOCALIZATION_KEY_COLOR_SCHEME_SYSTEM
    )) ?? null,
    name: COLOR_SCHEME_SYSTEM
});
