import { VARIABLE_BACKGROUND } from "../../../Adapter/ColorScheme/VARIABLE.mjs";

/** @typedef {import("../Port/ColorSchemeService.mjs").ColorSchemeService} ColorSchemeService */

export class GetBackgroundCommand {
    /**
     * @type {ColorSchemeService}
     */
    #color_scheme_service;

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @returns {GetBackgroundCommand}
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
    getBackground() {
        return this.#color_scheme_service.getVariable(
            VARIABLE_BACKGROUND
        );
    }
}
