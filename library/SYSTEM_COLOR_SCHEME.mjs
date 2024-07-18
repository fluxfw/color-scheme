import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATION_KEY_SYSTEM, LOCALIZATION_KEY_SYSTEM_WITH_COLOR_SCHEME } from "./Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("./ColorSchemeObject.mjs").ColorSchemeObject} ColorSchemeObject */

export const COLOR_SCHEME_SYSTEM = "system";

/**
 * @type {ColorSchemeObject}
 */
export const SYSTEM_COLOR_SCHEME = Object.freeze({
    label: async (localization = null, system_label = null) => (system_label !== null ? localization?.translate(
        LOCALIZATION_MODULE,
        LOCALIZATION_KEY_SYSTEM_WITH_COLOR_SCHEME,
        {
            "color-scheme": system_label
        }
    ) : localization?.translate(
        LOCALIZATION_MODULE,
        LOCALIZATION_KEY_SYSTEM
    )) ?? null,
    name: COLOR_SCHEME_SYSTEM
});
