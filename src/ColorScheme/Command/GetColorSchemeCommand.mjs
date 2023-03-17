import { COLOR_SCHEME_SETTINGS_KEY } from "../../Settings/COLOR_SCHEME_SETTINGS_KEY.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT } from "../COLOR_SCHEME.mjs";

/** @typedef {import("../ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("../ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("../../../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */
/** @typedef {import("../SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

export class GetColorSchemeCommand {
    /**
     * @type {ColorScheme[]}
     */
    #color_schemes;
    /**
     * @type {FluxSettingsApi}
     */
    #flux_settings_api;
    /**
     * @type {() => MediaQueryList}
     */
    #get_system_color_scheme_detector;
    /**
     * @type {SystemColorScheme | null}
     */
    #system_color_schemes;

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {FluxSettingsApi} flux_settings_api
     * @param {() => MediaQueryList} get_system_color_scheme_detector
     * @param {SystemColorScheme | null} system_color_schemes
     * @returns {GetColorSchemeCommand}
     */
    static new(color_schemes, flux_settings_api, get_system_color_scheme_detector, system_color_schemes = null) {
        return new this(
            color_schemes,
            flux_settings_api,
            get_system_color_scheme_detector,
            system_color_schemes
        );
    }

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {FluxSettingsApi} flux_settings_api
     * @param {() => MediaQueryList} get_system_color_scheme_detector
     * @param {SystemColorScheme | null} system_color_schemes
     * @private
     */
    constructor(color_schemes, flux_settings_api, get_system_color_scheme_detector, system_color_schemes) {
        this.#color_schemes = color_schemes;
        this.#flux_settings_api = flux_settings_api;
        this.#get_system_color_scheme_detector = get_system_color_scheme_detector;
        this.#system_color_schemes = system_color_schemes;
    }

    /**
     * @returns {Promise<ColorSchemeWithSystemColorScheme>}
     */
    async getColorScheme() {
        let color_scheme_name = await this.#flux_settings_api.get(
            COLOR_SCHEME_SETTINGS_KEY,
            ""
        );

        const system_color_scheme = this.#system_color_schemes !== null && color_scheme_name === "";
        if (system_color_scheme) {
            color_scheme_name = (this.#get_system_color_scheme_detector().matches ? this.#system_color_schemes[COLOR_SCHEME_DARK] : this.#system_color_schemes[COLOR_SCHEME_LIGHT]) ?? "";
        }

        const color_scheme = this.#color_schemes.find(_color_scheme => _color_scheme.name === color_scheme_name) ?? this.#color_schemes[0] ?? {};

        return {
            color_scheme: "",
            name: "",
            ...color_scheme,
            system_color_scheme
        };
    }
}
