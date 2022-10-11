import { SelectColorSchemeElement } from "../../../Adapter/ColorScheme/SelectColorSchemeElement.mjs";

/** @typedef {import("../../../Adapter/ColorScheme/ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("../Port/ColorSchemeService.mjs").ColorSchemeService} ColorSchemeService */
/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/ColorScheme/SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

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
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {SystemColorScheme | null}
     */
    #system_color_schemes;

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @param {ColorScheme[]} color_schemes
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @returns {GetSelectColorSchemeElementCommand}
     */
    static new(color_scheme_service, color_schemes, css_api, localization_api, system_color_schemes = null) {
        return new this(
            color_scheme_service,
            color_schemes,
            css_api,
            localization_api,
            system_color_schemes
        );
    }

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @param {ColorScheme[]} color_schemes
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @private
     */
    constructor(color_scheme_service, color_schemes, css_api, localization_api, system_color_schemes) {
        this.#color_scheme_service = color_scheme_service;
        this.#color_schemes = color_schemes;
        this.#css_api = css_api;
        this.#localization_api = localization_api;
        this.#system_color_schemes = system_color_schemes;
    }

    /**
     * @returns {SelectColorSchemeElement}
     */
    getSelectColorSchemeElement() {
        return SelectColorSchemeElement.new(
            this.#color_scheme_service.getColorScheme(),
            this.#color_schemes,
            this.#css_api,
            this.#localization_api,
            color_scheme_name => {
                this.#color_scheme_service.setColorScheme(
                    color_scheme_name
                );
            },
            this.#color_scheme_service.getVariables(
                true
            ),
            this.#system_color_schemes
        );
    }
}
