import { COLOR_SCHEME_CSS_PROPERTY_PREFIX } from "../../../Adapter/ColorScheme/COLOR_SCHEME_CSS_PROPERTY_PREFIX.mjs";

export class GetVariableCommand {
    /**
     * @returns {GetVariableCommand}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} variable
     * @returns {string}
     */
    getVariable(variable) {
        return getComputedStyle(document.documentElement).getPropertyValue(`${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${variable}`).trim();
    }
}
