/** @typedef {import("../ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("../ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("../../../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../../../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */
/** @typedef {import("../SelectColorSchemeElement.mjs").SelectColorSchemeElement} SelectColorSchemeElement */
/** @typedef {import("../SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

export class ColorSchemeService {
    /**
     * @type {string[] | null}
     */
    #additional_variables;
    /**
     * @type {ColorScheme[]}
     */
    #color_schemes;
    /**
     * @type {FluxCssApi}
     */
    #flux_css_api;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
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
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {FluxSettingsApi} flux_settings_api
     * @param {() => MediaQueryList} get_system_color_scheme_detector
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @returns {ColorSchemeService}
     */
    static new(color_schemes, flux_css_api, flux_localization_api, flux_settings_api, get_system_color_scheme_detector, system_color_schemes = null, additional_variables = null) {
        return new this(
            color_schemes,
            flux_css_api,
            flux_localization_api,
            flux_settings_api,
            get_system_color_scheme_detector,
            system_color_schemes,
            additional_variables
        );
    }

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {FluxSettingsApi} flux_settings_api
     * @param {() => MediaQueryList} get_system_color_scheme_detector
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @private
     */
    constructor(color_schemes, flux_css_api, flux_localization_api, flux_settings_api, get_system_color_scheme_detector, system_color_schemes, additional_variables) {
        this.#color_schemes = color_schemes;
        this.#flux_css_api = flux_css_api;
        this.#flux_localization_api = flux_localization_api;
        this.#flux_settings_api = flux_settings_api;
        this.#get_system_color_scheme_detector = get_system_color_scheme_detector;
        this.#system_color_schemes = system_color_schemes;
        this.#additional_variables = additional_variables;
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccent() {
        return (await import("../Command/GetAccentCommand.mjs")).GetAccentCommand.new(
            this
        )
            .getAccent();
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentForeground() {
        return (await import("../Command/GetAccentForegroundCommand.mjs")).GetAccentForegroundCommand.new(
            this
        )
            .getAccentForeground();
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentForegroundRgb() {
        return (await import("../Command/GetAccentForegroundRgbCommand.mjs")).GetAccentForegroundRgbCommand.new(
            this
        )
            .getAccentForegroundRgb();
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentRgb() {
        return (await import("../Command/GetAccentRgbCommand.mjs")).GetAccentRgbCommand.new(
            this
        )
            .getAccentRgb();
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackground() {
        return (await import("../Command/GetBackgroundCommand.mjs")).GetBackgroundCommand.new(
            this
        )
            .getBackground();
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackgroundRgb() {
        return (await import("../Command/GetBackgroundRgbCommand.mjs")).GetBackgroundRgbCommand.new(
            this
        )
            .getBackgroundRgb();
    }

    /**
     * @returns {Promise<ColorSchemeWithSystemColorScheme>}
     */
    async getColorScheme() {
        return (await import("../Command/GetColorSchemeCommand.mjs")).GetColorSchemeCommand.new(
            this.#color_schemes,
            this.#flux_settings_api,
            this.#get_system_color_scheme_detector,
            this.#system_color_schemes
        )
            .getColorScheme();
    }

    /**
     * @returns {Promise<string>}
     */
    async getForeground() {
        return (await import("../Command/GetForegroundCommand.mjs")).GetForegroundCommand.new(
            this
        )
            .getForeground();
    }

    /**
     * @returns {Promise<string>}
     */
    async getForegroundRgb() {
        return (await import("../Command/GetForegroundRgbCommand.mjs")).GetForegroundRgbCommand.new(
            this
        )
            .getForegroundRgb();
    }

    /**
     * @returns {Promise<SelectColorSchemeElement>}
     */
    async getSelectColorSchemeElement() {
        return (await import("../Command/GetSelectColorSchemeElementCommand.mjs")).GetSelectColorSchemeElementCommand.new(
            this,
            this.#color_schemes,
            this.#flux_css_api,
            this.#flux_localization_api,
            this.#system_color_schemes
        )
            .getSelectColorSchemeElement();
    }

    /**
     * @returns {Promise<MediaQueryList>}
     */
    async getSystemColorSchemeDetector() {
        return (await import("../Command/GetSystemColorSchemeDetectorCommand.mjs")).GetSystemColorSchemeDetectorCommand.new()
            .getSystemColorSchemeDetector();
    }

    /**
     * @param {string} variable
     * @returns {Promise<string>}
     */
    async getVariable(variable) {
        return (await import("../Command/GetVariableCommand.mjs")).GetVariableCommand.new()
            .getVariable(
                variable
            );
    }

    /**
     * @param {boolean} only_default
     * @returns {Promise<string[]>}
     */
    async getVariables(only_default = false) {
        return (await import("../Command/GetVariablesCommand.mjs")).GetVariablesCommand.new(
            this.#additional_variables
        )
            .getVariables(
                only_default
            );
    }

    /**
     * @param {boolean} only_if_system_color_scheme
     * @returns {Promise<void>}
     */
    async renderColorScheme(only_if_system_color_scheme = false) {
        await (await import("../Command/RenderColorSchemeCommand.mjs")).RenderColorSchemeCommand.new(
            this
        )
            .renderColorScheme(
                only_if_system_color_scheme
            );
    }

    /**
     * @param {string} color_scheme_name
     * @returns {Promise<void>}
     */
    async setColorScheme(color_scheme_name) {
        await (await import("../Command/SetColorSchemeCommand.mjs")).SetColorSchemeCommand.new(
            this,
            this.#flux_settings_api
        )
            .setColorScheme(
                color_scheme_name
            );
    }
}
