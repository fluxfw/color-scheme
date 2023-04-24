import { COLOR_SCHEME_CSS_PROPERTY_PREFIX } from "./ColorScheme/COLOR_SCHEME_CSS_PROPERTY_PREFIX.mjs";
import { COLOR_SCHEME_LOCALIZATION_MODULE } from "./Localization/_LOCALIZATION_MODULE.mjs";
import { COLOR_SCHEME_SETTINGS_KEY } from "./Settings/COLOR_SCHEME_SETTINGS_KEY.mjs";
import { flux_css_api } from "../../flux-css-api/src/FluxCssApi.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT } from "./ColorScheme/COLOR_SCHEME.mjs";
import { VARIABLE_ACCENT, VARIABLE_ACCENT_FOREGROUND, VARIABLE_ACCENT_FOREGROUND_RGB, VARIABLE_ACCENT_RGB, VARIABLE_BACKGROUND, VARIABLE_BACKGROUND_RGB, VARIABLE_FOREGROUND, VARIABLE_FOREGROUND_RGB } from "./ColorScheme/VARIABLE.mjs";

/** @typedef {import("./ColorScheme/ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("./ColorScheme/ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */
/** @typedef {import("./ColorScheme/SelectColorSchemeElement.mjs").SelectColorSchemeElement} SelectColorSchemeElement */
/** @typedef {import("./ColorScheme/SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

flux_css_api.adopt(
    document,
    await flux_css_api.import(
        `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/ColorScheme/ColorSchemeVariables.css`
    ),
    true
);

export class FluxColorScheme {
    /**
     * @type {string[] | null}
     */
    #additional_variables;
    /**
     * @type {ColorScheme[]}
     */
    #color_schemes;
    /**
     * @type {FluxLocalizationApi | null}
     */
    #flux_localization_api;
    /**
     * @type {FluxSettingsApi | null}
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
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @returns {FluxColorScheme}
     */
    static new(color_schemes, flux_localization_api = null, flux_settings_api = null, system_color_schemes = null, additional_variables = null) {
        return new this(
            color_schemes,
            flux_localization_api,
            flux_settings_api,
            system_color_schemes,
            additional_variables
        );
    }

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @param {SystemColorScheme | null} system_color_schemes
     * @param {string[] | null} additional_variables
     * @private
     */
    constructor(color_schemes, flux_localization_api, flux_settings_api, system_color_schemes, additional_variables) {
        this.#color_schemes = color_schemes;
        this.#flux_localization_api = flux_localization_api;
        this.#flux_settings_api = flux_settings_api;
        this.#system_color_schemes = system_color_schemes;
        this.#additional_variables = additional_variables;

        if (this.#flux_localization_api !== null) {
            this.#flux_localization_api.addModule(
                `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/Localization`,
                COLOR_SCHEME_LOCALIZATION_MODULE
            );
        }

        this.renderColorScheme();
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccent() {
        return this.getVariable(
            VARIABLE_ACCENT
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentForeground() {
        return this.getVariable(
            VARIABLE_ACCENT_FOREGROUND
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentForegroundRgb() {
        return this.getVariable(
            VARIABLE_ACCENT_FOREGROUND_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentRgb() {
        return this.getVariable(
            VARIABLE_ACCENT_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackground() {
        return this.getVariable(
            VARIABLE_BACKGROUND
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackgroundRgb() {
        return this.getVariable(
            VARIABLE_BACKGROUND_RGB
        );
    }

    /**
     * @returns {Promise<ColorSchemeWithSystemColorScheme>}
     */
    async getColorScheme() {
        let color_scheme_name = await this.#flux_settings_api?.get(
            COLOR_SCHEME_SETTINGS_KEY
        ) ?? "";

        const system_color_scheme = this.#system_color_schemes !== null && color_scheme_name === "";
        if (system_color_scheme) {
            color_scheme_name = ((await this.#getSystemColorSchemeDetector()).matches ? this.#system_color_schemes[COLOR_SCHEME_DARK] : this.#system_color_schemes[COLOR_SCHEME_LIGHT]) ?? "";
        }

        const color_scheme = this.#color_schemes.find(_color_scheme => _color_scheme.name === color_scheme_name) ?? this.#color_schemes[0] ?? {};

        return {
            color_scheme: "",
            name: "",
            ...color_scheme,
            system_color_scheme
        };
    }

    /**
     * @returns {Promise<string>}
     */
    async getForeground() {
        return this.getVariable(
            VARIABLE_FOREGROUND
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getForegroundRgb() {
        return this.getVariable(
            VARIABLE_FOREGROUND_RGB
        );
    }

    /**
     * @returns {Promise<SelectColorSchemeElement>}
     */
    async getSelectColorSchemeElement() {
        if (this.#flux_localization_api === null) {
            throw new Error("Missing FluxLocalizationApi");
        }

        return (await import("./ColorScheme/SelectColorSchemeElement.mjs")).SelectColorSchemeElement.new(
            await this.getColorScheme(),
            this.#color_schemes,
            this.#flux_localization_api,
            color_scheme_name => {
                this.#setColorScheme(
                    color_scheme_name
                );
            },
            await this.#getVariables(
                true
            ),
            this.#system_color_schemes
        );
    }

    /**
     * @param {string} variable
     * @returns {Promise<string>}
     */
    async getVariable(variable) {
        return getComputedStyle(document.documentElement).getPropertyValue(`${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${variable}`).trim();
    }

    /**
     * @param {boolean | null} only_if_system_color_scheme
     * @returns {Promise<void>}
     */
    async renderColorScheme(only_if_system_color_scheme = null) {
        const color_scheme = await this.getColorScheme();

        if ((only_if_system_color_scheme ?? false) && !color_scheme.system_color_scheme) {
            return;
        }

        for (const key of Array.from(document.documentElement.style).filter(_key => _key.startsWith(COLOR_SCHEME_CSS_PROPERTY_PREFIX))) {
            document.documentElement.style.removeProperty(key);
        }
        for (const variable of await this.#getVariables()) {
            document.documentElement.style.setProperty(`${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${variable}`, `var(${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${color_scheme.name}-${variable})`);
        }

        const color_scheme_meta = document.head.querySelector("meta[name=color-scheme]") ?? document.createElement("meta");
        color_scheme_meta.content = color_scheme.color_scheme !== "" ? color_scheme.color_scheme : COLOR_SCHEME_LIGHT;
        color_scheme_meta.name = "color-scheme";
        if (!color_scheme_meta.isConnected) {
            document.head.appendChild(color_scheme_meta);
        }

        const theme_color_meta = document.head.querySelector("meta[name=theme-color]") ?? document.createElement("meta");
        theme_color_meta.content = await this.getAccent();
        theme_color_meta.name = "theme-color";
        if (!theme_color_meta.isConnected) {
            document.head.appendChild(theme_color_meta);
        }
    }

    /**
     * @returns {Promise<MediaQueryList>}
     */
    async #getSystemColorSchemeDetector() {
        if (this.#system_color_scheme_detector === null) {
            this.#system_color_scheme_detector ??= matchMedia(`(prefers-color-scheme:${COLOR_SCHEME_DARK})`);

            this.#system_color_scheme_detector.addEventListener("change", () => {
                this.renderColorScheme(
                    true
                );
            });
        }

        return this.#system_color_scheme_detector;
    }

    /**
     * @param {boolean | null} only_default
     * @returns {Promise<string[]>}
     */
    async #getVariables(only_default = null) {
        return Array.from(new Set([
            VARIABLE_ACCENT,
            VARIABLE_ACCENT_FOREGROUND,
            VARIABLE_ACCENT_FOREGROUND_RGB,
            VARIABLE_ACCENT_RGB,
            VARIABLE_BACKGROUND,
            VARIABLE_BACKGROUND_RGB,
            VARIABLE_FOREGROUND,
            VARIABLE_FOREGROUND_RGB,
            ...(!(only_default ?? false) ? this.#additional_variables : null) ?? []
        ]));
    }

    /**
     * @param {string} color_scheme_name
     * @returns {Promise<void>}
     */
    async #setColorScheme(color_scheme_name) {
        if (this.#flux_settings_api === null) {
            throw new Error("Missing FluxSettingsApi");
        }

        await this.#flux_settings_api.store(
            COLOR_SCHEME_SETTINGS_KEY,
            color_scheme_name
        );

        await this.renderColorScheme();
    }
}
