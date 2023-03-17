import { VARIABLE_BACKGROUND_RGB } from "../VARIABLE.mjs";

/** @typedef {import("../Port/ColorSchemeService.mjs").ColorSchemeService} ColorSchemeService */

export class GetBackgroundRgbCommand {
    /**
     * @type {ColorSchemeService}
     */
    #color_scheme_service;

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @returns {GetBackgroundRgbCommand}
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
     * @returns {Promise<string>}
     */
    async getBackgroundRgb() {
        return this.#color_scheme_service.getVariable(
            VARIABLE_BACKGROUND_RGB
        );
    }
}
