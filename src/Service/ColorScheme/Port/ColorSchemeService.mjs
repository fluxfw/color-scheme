import { GetAccentCommand } from "../Command/GetAccentCommand.mjs";
import { GetBackgroundCommand } from "../Command/GetBackgroundCommand.mjs";
import { GetColorSchemeCommand } from "../Command/GetColorSchemeCommand.mjs";
import { GetForegroundCommand } from "../Command/GetForegroundCommand.mjs";
import { GetVariableCommand } from "../Command/GetVariableCommand.mjs";
import { GetVariablesCommand } from "../Command/GetVariablesCommand.mjs";
import { RenderColorSchemeCommand } from "../Command/RenderColorSchemeCommand.mjs";
import { SetColorSchemeCommand } from "../Command/SetColorSchemeCommand.mjs";

/** @typedef {import("../../../Adapter/ColorScheme/ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("../../../Adapter/ColorScheme/ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("../../../Adapter/ColorScheme/getColorSchemeChangeListeners.mjs").getColorSchemeChangeListeners} getColorSchemeChangeListeners */
/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/ColorScheme/SelectColorSchemeElement.mjs").SelectColorSchemeElement} SelectColorSchemeElement */
/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */
/** @typedef {import("../../../Adapter/ColorScheme/SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

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
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {getColorSchemeChangeListeners}
     */
    #get_color_scheme_change_listeners;
    /**
     * @type {() => MediaQueryList}
     */
    #get_system_color_scheme_detector;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
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
     * @param {CssApi} css_api
     * @param {getColorSchemeChangeListeners} get_color_scheme_change_listeners
     * @param {() => MediaQueryList} get_system_color_scheme_detector
     * @param {LocalizationApi} localization_api
     * @param {SettingsApi} settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @returns {ColorSchemeService}
     */
    static new(color_schemes, css_api, get_color_scheme_change_listeners, get_system_color_scheme_detector, localization_api, settings_api, system_color_schemes = null, additional_variables = null) {
        return new this(
            color_schemes,
            css_api,
            get_color_scheme_change_listeners,
            get_system_color_scheme_detector,
            localization_api,
            settings_api,
            system_color_schemes,
            additional_variables
        );
    }

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {CssApi} css_api
     * @param {getColorSchemeChangeListeners} get_color_scheme_change_listeners
     * @param {() => MediaQueryList} get_system_color_scheme_detector
     * @param {LocalizationApi} localization_api
     * @param {SettingsApi} settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @private
     */
    constructor(color_schemes, css_api, get_color_scheme_change_listeners, get_system_color_scheme_detector, localization_api, settings_api, system_color_schemes, additional_variables) {
        this.#color_schemes = color_schemes;
        this.#css_api = css_api;
        this.#get_color_scheme_change_listeners = get_color_scheme_change_listeners;
        this.#get_system_color_scheme_detector = get_system_color_scheme_detector;
        this.#localization_api = localization_api;
        this.#settings_api = settings_api;
        this.#system_color_schemes = system_color_schemes;
        this.#additional_variables = additional_variables;
    }

    /**
     * @returns {string}
     */
    getAccent() {
        return GetAccentCommand.new(
            this
        )
            .getAccent();
    }

    /**
     * @returns {string}
     */
    getBackground() {
        return GetBackgroundCommand.new(
            this
        )
            .getBackground();
    }

    /**
     * @returns {ColorSchemeWithSystemColorScheme}
     */
    getColorScheme() {
        return GetColorSchemeCommand.new(
            this.#color_schemes,
            this.#get_system_color_scheme_detector,
            this.#settings_api,
            this.#system_color_schemes
        )
            .getColorScheme();
    }

    /**
     * @returns {string}
     */
    getForeground() {
        return GetForegroundCommand.new(
            this
        )
            .getForeground();
    }

    /**
     * @returns {Promise<SelectColorSchemeElement>}
     */
    async getSelectColorSchemeElement() {
        return (await import("../Command/GetSelectColorSchemeElementCommand.mjs")).GetSelectColorSchemeElementCommand.new(
            this,
            this.#color_schemes,
            this.#css_api,
            this.#localization_api,
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
     * @returns {string}
     */
    getVariable(variable) {
        return GetVariableCommand.new()
            .getVariable(
                variable
            );
    }

    /**
     * @param {boolean} only_default
     * @returns {string[]}
     */
    getVariables(only_default = false) {
        return GetVariablesCommand.new(
            this.#additional_variables
        )
            .getVariables(
                only_default
            );
    }

    /**
     * @param {boolean} only_if_system_color_scheme
     * @returns {void}
     */
    renderColorScheme(only_if_system_color_scheme = false) {
        RenderColorSchemeCommand.new(
            this,
            this.#get_color_scheme_change_listeners
        )
            .renderColorScheme(
                only_if_system_color_scheme
            );
    }

    /**
     * @param {string} color_scheme_name
     * @returns {void}
     */
    setColorScheme(color_scheme_name) {
        SetColorSchemeCommand.new(
            this,
            this.#settings_api
        )
            .setColorScheme(
                color_scheme_name
            );
    }
}
