import { COLOR_SCHEME_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";
import { ColorSchemeService } from "../../Service/ColorScheme/Port/ColorSchemeService.mjs";

/** @typedef {import("../ColorScheme/ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("../ColorScheme/colorSchemeChangeListener.mjs").colorSchemeChangeListener} colorSchemeChangeListener */
/** @typedef {import("../ColorScheme/ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../ColorScheme/SelectColorSchemeElement.mjs").SelectColorSchemeElement} SelectColorSchemeElement */
/** @typedef {import("../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */
/** @typedef {import("../ColorScheme/SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class ColorSchemeApi {
    /**
     * @type {string[] | null}
     */
    #additional_variables;
    /**
     * @type {colorSchemeChangeListener[]}
     */
    #color_scheme_change_listeners;
    /**
     * @type {ColorSchemeService | null}
     */
    #color_scheme_service = null;
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
     * @type {SettingsApi}
     */
    #settings_api;
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
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {SettingsApi} settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @returns {ColorSchemeApi}
     */
    static new(color_schemes, css_api, localization_api, settings_api, system_color_schemes = null, additional_variables = null) {
        return new this(
            color_schemes,
            css_api,
            localization_api,
            settings_api,
            system_color_schemes,
            additional_variables
        );
    }

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {SettingsApi} settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @private
     */
    constructor(color_schemes, css_api, localization_api, settings_api, system_color_schemes, additional_variables) {
        this.#color_schemes = color_schemes;
        this.#css_api = css_api;
        this.#localization_api = localization_api;
        this.#settings_api = settings_api;
        this.#system_color_schemes = system_color_schemes;
        this.#additional_variables = additional_variables;
        this.#color_scheme_change_listeners = [];
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        this.#color_scheme_service ??= this.#getColorSchemeService();

        if (this.#system_color_scheme_detector === null) {
            this.#system_color_scheme_detector ??= this.#getSystemColorSchemeDetector();

            this.#system_color_scheme_detector.addEventListener("change", () => {
                this.#renderColorScheme(
                    true
                );
            });
        }

        this.#localization_api.addModule(
            `${__dirname}/../Localization`,
            COLOR_SCHEME_LOCALIZATION_MODULE
        );

        this.#css_api.importCssToRoot(
            document,
            `${__dirname}/../ColorScheme/ColorSchemeVariables.css`
        );
        this.#css_api.importCssToRoot(
            document,
            `${__dirname}/../ColorScheme/SelectColorSchemeVariables.css`
        );

        this.#renderColorScheme();
    }

    /**
     * @param {colorSchemeChangeListener} color_scheme_change_listener
     * @returns {void}
     */
    addColorSchemeChangeListener(color_scheme_change_listener) {
        this.#color_scheme_change_listeners.push(color_scheme_change_listener);

        color_scheme_change_listener(
            this.getColorScheme()
        );
    }

    /**
     * @returns {ColorSchemeWithSystemColorScheme}
     */
    getColorScheme() {
        return this.#color_scheme_service.getColorScheme();
    }

    /**
     * @returns {SelectColorSchemeElement}
     */
    getSelectColorSchemeElement() {
        return this.#color_scheme_service.getSelectColorSchemeElement();
    }

    /**
     * @param {string} variable
     * @returns {string}
     */
    getVariable(variable) {
        return this.#color_scheme_service.getVariable(
            variable
        );
    }

    /**
     * @returns {ColorSchemeService}
     */
    #getColorSchemeService() {
        return ColorSchemeService.new(
            this.#color_schemes,
            this.#css_api,
            () => this.#color_scheme_change_listeners,
            () => this.#system_color_scheme_detector,
            this.#localization_api,
            this.#settings_api,
            this.#system_color_schemes,
            this.#additional_variables
        );
    }

    /**
     * @returns {MediaQueryList}
     */
    #getSystemColorSchemeDetector() {
        return this.#color_scheme_service.getSystemColorSchemeDetector();
    }

    /**
     * @param {boolean} only_if_system_color_scheme
     * @returns {void}
     */
    #renderColorScheme(only_if_system_color_scheme = false) {
        this.#color_scheme_service.renderColorScheme(
            only_if_system_color_scheme
        );
    }
}
