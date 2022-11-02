import { COLOR_SCHEME_SETTINGS_KEY } from "../../../Adapter/Settings/COLOR_SCHEME_SETTINGS_KEY.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT } from "../../../Adapter/ColorScheme/COLOR_SCHEME.mjs";

/** @typedef {import("../../../Adapter/ColorScheme/ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("../../../Adapter/ColorScheme/ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */
/** @typedef {import("../../../Adapter/ColorScheme/SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

export class GetColorSchemeCommand {
    /**
     * @type {ColorScheme[]}
     */
    #color_schemes;
    /**
     * @type {() => MediaQueryList}
     */
    #get_system_color_scheme_detector;
    /**
     * @type {SettingsApi}
     */
    #settings_api;
    /**
     * @type {SystemColorScheme | null}
     */
    #system_color_schemes;

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {() => MediaQueryList} get_system_color_scheme_detector
     * @param {SettingsApi} settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @returns {GetColorSchemeCommand}
     */
    static new(color_schemes, get_system_color_scheme_detector, settings_api, system_color_schemes = null) {
        return new this(
            color_schemes,
            get_system_color_scheme_detector,
            settings_api,
            system_color_schemes
        );
    }

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {() => MediaQueryList} get_system_color_scheme_detector
     * @param {SettingsApi} settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @private
     */
    constructor(color_schemes, get_system_color_scheme_detector, settings_api, system_color_schemes) {
        this.#color_schemes = color_schemes;
        this.#get_system_color_scheme_detector = get_system_color_scheme_detector;
        this.#settings_api = settings_api;
        this.#system_color_schemes = system_color_schemes;
    }

    /**
     * @returns {Promise<ColorSchemeWithSystemColorScheme>}
     */
    async getColorScheme() {
        let color_scheme_name = this.#settings_api.get(
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
