import { VARIABLE_FOREGROUND } from "../../../Adapter/ColorScheme/VARIABLE.mjs";

/** @typedef {import("../Port/ColorSchemeService.mjs").ColorSchemeService} ColorSchemeService */

export class GetForegroundCommand {
    /**
     * @type {ColorSchemeService}
     */
    #color_scheme_service;

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @returns {GetForegroundCommand}
     */
    static new(color_scheme_service) {
        return new this(
            color_scheme_service
        );
    }

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @private
     */
    constructor(color_scheme_service) {
        this.#color_scheme_service = color_scheme_service;
    }

    /**
     * @returns {string}
     */
    getForeground() {
        return this.#color_scheme_service.getVariable(
            VARIABLE_FOREGROUND
        );
    }
}
