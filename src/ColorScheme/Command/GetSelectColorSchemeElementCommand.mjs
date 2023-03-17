/** @typedef {import("../ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("../Port/ColorSchemeService.mjs").ColorSchemeService} ColorSchemeService */
/** @typedef {import("../../../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../SelectColorSchemeElement.mjs").SelectColorSchemeElement} SelectColorSchemeElement */
/** @typedef {import("../SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

export class GetSelectColorSchemeElementCommand {
    /**
     * @type {ColorSchemeService}
     */
    #color_scheme_service;
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
     * @type {SystemColorScheme | null}
     */
    #system_color_schemes;

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @param {ColorScheme[]} color_schemes
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @returns {GetSelectColorSchemeElementCommand}
     */
    static new(color_scheme_service, color_schemes, flux_css_api, flux_localization_api, system_color_schemes = null) {
        return new this(
            color_scheme_service,
            color_schemes,
            flux_css_api,
            flux_localization_api,
            system_color_schemes
        );
    }

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @param {ColorScheme[]} color_schemes
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @private
     */
    constructor(color_scheme_service, color_schemes, flux_css_api, flux_localization_api, system_color_schemes) {
        this.#color_scheme_service = color_scheme_service;
        this.#color_schemes = color_schemes;
        this.#flux_css_api = flux_css_api;
        this.#flux_localization_api = flux_localization_api;
        this.#system_color_schemes = system_color_schemes;
    }

    /**
     * @returns {Promise<SelectColorSchemeElement>}
     */
    async getSelectColorSchemeElement() {
        return (await import("../SelectColorSchemeElement.mjs")).SelectColorSchemeElement.new(
            await this.#color_scheme_service.getColorScheme(),
            this.#color_schemes,
            this.#flux_css_api,
            this.#flux_localization_api,
            color_scheme_name => {
                this.#color_scheme_service.setColorScheme(
                    color_scheme_name
                );
            },
            await this.#color_scheme_service.getVariables(
                true
            ),
            this.#system_color_schemes
        );
    }
}
