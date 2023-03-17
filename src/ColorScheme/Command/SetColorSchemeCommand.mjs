import { COLOR_SCHEME_SETTINGS_KEY } from "../../Settings/COLOR_SCHEME_SETTINGS_KEY.mjs";

/** @typedef {import("../Port/ColorSchemeService.mjs").ColorSchemeService} ColorSchemeService */
/** @typedef {import("../../../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */

export class SetColorSchemeCommand {
    /**
     * @type {ColorSchemeService}
     */
    #color_scheme_service;
    /**
     * @type {FluxSettingsApi}
     */
    #flux_settings_api;

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @param {FluxSettingsApi} flux_settings_api
     * @returns {SetColorSchemeCommand}
     */
    static new(color_scheme_service, flux_settings_api) {
        return new this(
            color_scheme_service,
            flux_settings_api
        );
    }

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @param {FluxSettingsApi} flux_settings_api
     * @private
     */
    constructor(color_scheme_service, flux_settings_api) {
        this.#color_scheme_service = color_scheme_service;
        this.#flux_settings_api = flux_settings_api;
    }

    /**
     * @param {string} color_scheme_name
     * @returns {Promise<void>}
     */
    async setColorScheme(color_scheme_name) {
        await this.#flux_settings_api.store(
            COLOR_SCHEME_SETTINGS_KEY,
            color_scheme_name
        );

        await this.#color_scheme_service.renderColorScheme();
    }
}
