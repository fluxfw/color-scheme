import { COLOR_SCHEME_LOCALIZATION_MODULE } from "./Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("./ColorScheme/ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("./ColorScheme/Port/ColorSchemeService.mjs").ColorSchemeService} ColorSchemeService */
/** @typedef {import("./ColorScheme/ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */
/** @typedef {import("./ColorScheme/SelectColorSchemeElement.mjs").SelectColorSchemeElement} SelectColorSchemeElement */
/** @typedef {import("./ColorScheme/SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FluxColorScheme {
    /**
     * @type {string[] | null}
     */
    #additional_variables;
    /**
     * @type {ColorSchemeService | null}
     */
    #color_scheme_service = null;
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
     * @type {MediaQueryList | null}
     */
    #system_color_scheme_detector = null;
    /**
     * @type {SystemColorScheme | null}
     */
    #system_color_schemes;

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {FluxSettingsApi} flux_settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @returns {FluxColorScheme}
     */
    static new(color_schemes, flux_css_api, flux_localization_api, flux_settings_api, system_color_schemes = null, additional_variables = null) {
        return new this(
            color_schemes,
            flux_css_api,
            flux_localization_api,
            flux_settings_api,
            system_color_schemes,
            additional_variables
        );
    }

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {FluxSettingsApi} flux_settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @private
     */
    constructor(color_schemes, flux_css_api, flux_localization_api, flux_settings_api, system_color_schemes, additional_variables) {
        this.#color_schemes = color_schemes;
        this.#flux_css_api = flux_css_api;
        this.#flux_localization_api = flux_localization_api;
        this.#flux_settings_api = flux_settings_api;
        this.#system_color_schemes = system_color_schemes;
        this.#additional_variables = additional_variables;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        if (this.#system_color_scheme_detector === null) {
            this.#system_color_scheme_detector ??= await this.#getSystemColorSchemeDetector();

            this.#system_color_scheme_detector.addEventListener("change", () => {
                this.renderColorScheme(
                    true
                );
            });
        }

        await this.#flux_localization_api.addModule(
            `${__dirname}/Localization`,
            COLOR_SCHEME_LOCALIZATION_MODULE
        );

        this.#flux_css_api.importCssToRoot(
            document,
            `${__dirname}/ColorScheme/ColorSchemeVariables.css`
        );
        this.#flux_css_api.importCssToRoot(
            document,
            `${__dirname}/ColorScheme/SelectColorSchemeVariables.css`
        );

        await this.renderColorScheme();
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccent() {
        return (await this.#getColorSchemeService()).getAccent();
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentForeground() {
        return (await this.#getColorSchemeService()).getAccentForeground();
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentForegroundRgb() {
        return (await this.#getColorSchemeService()).getAccentForegroundRgb();
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentRgb() {
        return (await this.#getColorSchemeService()).getAccentRgb();
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackground() {
        return (await this.#getColorSchemeService()).getBackground();
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackgroundRgb() {
        return (await this.#getColorSchemeService()).getBackgroundRgb();
    }

    /**
     * @returns {Promise<ColorSchemeWithSystemColorScheme>}
     */
    async getColorScheme() {
        return (await this.#getColorSchemeService()).getColorScheme();
    }

    /**
     * @returns {Promise<string>}
     */
    async getForeground() {
        return (await this.#getColorSchemeService()).getForeground();
    }

    /**
     * @returns {Promise<string>}
     */
    async getForegroundRgb() {
        return (await this.#getColorSchemeService()).getForegroundRgb();
    }

    /**
     * @returns {Promise<SelectColorSchemeElement>}
     */
    async getSelectColorSchemeElement() {
        return (await this.#getColorSchemeService()).getSelectColorSchemeElement();
    }

    /**
     * @param {string} variable
     * @returns {Promise<string>}
     */
    async getVariable(variable) {
        return (await this.#getColorSchemeService()).getVariable(
            variable
        );
    }

    /**
     * @param {boolean} only_if_system_color_scheme
     * @returns {Promise<void>}
     */
    async renderColorScheme(only_if_system_color_scheme = false) {
        await (await this.#getColorSchemeService()).renderColorScheme(
            only_if_system_color_scheme
        );
    }

    /**
     * @returns {Promise<ColorSchemeService>}
     */
    async #getColorSchemeService() {
        this.#color_scheme_service ??= (await import("./ColorScheme/Port/ColorSchemeService.mjs")).ColorSchemeService.new(
            this.#color_schemes,
            this.#flux_css_api,
            this.#flux_localization_api,
            this.#flux_settings_api,
            () => this.#system_color_scheme_detector,
            this.#system_color_schemes,
            this.#additional_variables
        );

        return this.#color_scheme_service;
    }

    /**
     * @returns {Promise<MediaQueryList>}
     */
    async #getSystemColorSchemeDetector() {
        return (await this.#getColorSchemeService()).getSystemColorSchemeDetector();
    }
}
