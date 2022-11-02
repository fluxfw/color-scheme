import { COLOR_SCHEME_SETTINGS_KEY } from "../../../Adapter/Settings/COLOR_SCHEME_SETTINGS_KEY.mjs";

/** @typedef {import("../Port/ColorSchemeService.mjs").ColorSchemeService} ColorSchemeService */
/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */

export class SetColorSchemeCommand {
    /**
     * @type {ColorSchemeService}
     */
    #color_scheme_service;
    /**
     * @type {SettingsApi}
     */
    #settings_api;

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @param {SettingsApi} settings_api
     * @returns {SetColorSchemeCommand}
     */
    static new(color_scheme_service, settings_api) {
        return new this(
            color_scheme_service,
            settings_api
        );
    }

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @param {SettingsApi} settings_api
     * @private
     */
    constructor(color_scheme_service, settings_api) {
        this.#color_scheme_service = color_scheme_service;
        this.#settings_api = settings_api;
    }

    /**
     * @param {string} color_scheme_name
     * @returns {Promise<void>}
     */
    async setColorScheme(color_scheme_name) {
        this.#settings_api.store(
            COLOR_SCHEME_SETTINGS_KEY,
            color_scheme_name
        );

        await this.#color_scheme_service.renderColorScheme();
    }
}
