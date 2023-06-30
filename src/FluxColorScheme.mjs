import { COLOR_SCHEME_CSS_PROPERTY_PREFIX } from "./ColorScheme/COLOR_SCHEME_CSS_PROPERTY_PREFIX.mjs";
import { COLOR_SCHEME_LOCALIZATION_MODULE } from "./Localization/_LOCALIZATION_MODULE.mjs";
import { flux_css_api } from "../../flux-css-api/src/FluxCssApi.mjs";
import { COLOR_SCHEME_LIGHT, COLOR_SCHEME_SYSTEM } from "./ColorScheme/COLOR_SCHEME.mjs";
import { COLOR_SCHEME_SETTINGS_KEY, COLOR_SCHEME_SYSTEM_SETTINGS_KEY } from "./Settings/COLOR_SCHEME_SETTINGS_KEY.mjs";
import { COLOR_SCHEME_VARIABLE_ACCENT, COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND, COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND_RGB, COLOR_SCHEME_VARIABLE_ACCENT_RGB, COLOR_SCHEME_VARIABLE_BACKGROUND, COLOR_SCHEME_VARIABLE_BACKGROUND_RGB, COLOR_SCHEME_VARIABLE_FOREGROUND, COLOR_SCHEME_VARIABLE_FOREGROUND_RGB } from "./ColorScheme/COLOR_SCHEME_VARIABLE.mjs";
import { DEFAULT_COLOR_SCHEMES, DEFAULT_SYSTEM_COLOR_SCHEMES } from "./ColorScheme/DEFAULT_COLOR_SCHEMES.mjs";

/** @typedef {import("./ColorScheme/ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("./ColorScheme/ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./ColorScheme/FluxSelectColorSchemeElement.mjs").FluxSelectColorSchemeElement} FluxSelectColorSchemeElement */
/** @typedef {import("../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */
/** @typedef {import("./ColorScheme/SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

const variables_css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/ColorScheme/FluxColorSchemeVariables.css`
);

document.adoptedStyleSheets.unshift(variables_css);

export class FluxColorScheme {
    /**
     * @type {string[]}
     */
    #additional_variables;
    /**
     * @type {ColorScheme[]}
     */
    #color_schemes;
    /**
     * @type {string}
     */
    #default_color_scheme;
    /**
     * @type {FluxLocalizationApi | null}
     */
    #flux_localization_api;
    /**
     * @type {FluxSettingsApi | null}
     */
    #flux_settings_api;
    /**
     * @type {() => {} | null}
     */
    #init_system_color_scheme_detectors = null;
    /**
     * @type {boolean}
     */
    #set_system_color_schemes;
    /**
     * @type {boolean}
     */
    #show_color_scheme_accent_color;
    /**
     * @type {SystemColorScheme[]}
     */
    #system_color_schemes;
    /**
     * @type {CSSStyleRule | null}
     */
    #variables_style_sheet_rule = null;

    /**
     * @param {ColorScheme[] | null} color_schemes
     * @param {string | null} default_color_scheme
     * @param {string[] | null} additional_variables
     * @param {SystemColorScheme[] | null} system_color_schemes
     * @param {boolean | null} set_system_color_schemes
     * @param {boolean | null} show_color_scheme_accent_color
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @returns {Promise<FluxColorScheme>}
     */
    static async new(color_schemes, default_color_scheme = null, additional_variables = null, system_color_schemes = null, set_system_color_schemes = null, show_color_scheme_accent_color = null, flux_localization_api = null, flux_settings_api = null) {
        const _color_schemes = color_schemes ?? DEFAULT_COLOR_SCHEMES;

        const flux_color_scheme = new this(
            _color_schemes,
            default_color_scheme ?? (_color_schemes.some(color_scheme => color_scheme.name === COLOR_SCHEME_SYSTEM) ? null : _color_schemes[0]?.name ?? null) ?? COLOR_SCHEME_SYSTEM,
            additional_variables ?? [],
            system_color_schemes ?? DEFAULT_SYSTEM_COLOR_SCHEMES,
            set_system_color_schemes ?? false,
            show_color_scheme_accent_color ?? false,
            flux_localization_api,
            flux_settings_api
        );

        await flux_color_scheme.#render();

        return flux_color_scheme;
    }

    /**
     * @param {ColorScheme[]} color_schemes
     * @param {string} default_color_scheme
     * @param {string[]} additional_variables
     * @param {SystemColorScheme[]} system_color_schemes
     * @param {boolean} set_system_color_schemes
     * @param {boolean} show_color_scheme_accent_color
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @private
     */
    constructor(color_schemes, default_color_scheme, additional_variables, system_color_schemes, set_system_color_schemes, show_color_scheme_accent_color, flux_localization_api, flux_settings_api) {
        this.#color_schemes = color_schemes;
        this.#default_color_scheme = default_color_scheme;
        this.#additional_variables = additional_variables;
        this.#system_color_schemes = system_color_schemes;
        this.#set_system_color_schemes = set_system_color_schemes;
        this.#show_color_scheme_accent_color = show_color_scheme_accent_color;
        this.#flux_localization_api = flux_localization_api;
        this.#flux_settings_api = flux_settings_api;

        if (this.#flux_localization_api !== null) {
            this.#flux_localization_api.addModule(
                `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/Localization`,
                COLOR_SCHEME_LOCALIZATION_MODULE
            );
        }
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccent() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentForeground() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentForegroundRgb() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentRgb() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackground() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_BACKGROUND
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackgroundRgb() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_BACKGROUND_RGB
        );
    }

    /**
     * @returns {Promise<ColorSchemeWithSystemColorScheme>}
     */
    async getColorScheme() {
        const [
            color_scheme,
            system
        ] = await this.#getSettings();

        const is_system_color_scheme = color_scheme.name === COLOR_SCHEME_SYSTEM;

        await this.#initSystemColorSchemesDetectors(
            is_system_color_scheme
        );

        let _color_scheme = color_scheme;
        let system_color_scheme = null;

        if (is_system_color_scheme) {
            _color_scheme = null;

            system_color_scheme = await this.#getCurrentSystemColorScheme();

            if (system_color_scheme !== null && (system[system_color_scheme.name] ?? null) !== null) {
                _color_scheme = system[system_color_scheme.name];
            }

            if (_color_scheme === null) {
                throw new Error("Invalid color scheme");
            }
        }

        return {
            ..._color_scheme,
            system_color_scheme
        };
    }

    /**
     * @returns {Promise<string>}
     */
    async getForeground() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_FOREGROUND
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getForegroundRgb() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_FOREGROUND_RGB
        );
    }

    /**
     * @returns {Promise<FluxSelectColorSchemeElement>}
     */
    async getSelectColorSchemeElement() {
        if (this.#flux_localization_api === null) {
            throw new Error("Missing FluxLocalizationApi");
        }

        return (await import("./ColorScheme/FluxSelectColorSchemeElement.mjs")).FluxSelectColorSchemeElement.new(
            this.#color_schemes,
            this.#system_color_schemes,
            this.#set_system_color_schemes,
            this.#show_color_scheme_accent_color,
            await this.#getSettings(),
            async settings => {
                await this.#setSettings(
                    settings
                );
            },
            this.#flux_localization_api
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
     * @param {string} name
     * @returns {Promise<ColorScheme | null>}
     */
    async #getColorSchemeByName(name) {
        return this.#color_schemes.find(color_scheme => color_scheme.name === name) ?? null;
    }

    /**
     * @returns {Promise<SystemColorScheme | null>}
     */
    async #getCurrentSystemColorScheme() {
        return this.#system_color_schemes.find(system_color_scheme => system_color_scheme.detector.matches) ?? null;
    }

    /**
     * @returns {Promise<[ColorScheme, {[key: string]: ColorScheme}]>}
     */
    async #getSettings() {
        let color_scheme = null;

        const name = await this.#flux_settings_api?.get(
            COLOR_SCHEME_SETTINGS_KEY
        ) ?? null;

        if (name !== null) {
            color_scheme = await this.#getColorSchemeByName(
                name
            );
        }

        if (color_scheme === null) {
            color_scheme = await this.#getColorSchemeByName(
                this.#default_color_scheme
            );
        }

        if (color_scheme === null) {
            throw new Error("Invalid color scheme");
        }

        const system = this.#set_system_color_schemes ? await this.#flux_settings_api?.get(
            COLOR_SCHEME_SYSTEM_SETTINGS_KEY
        ) ?? null : null;

        return [
            color_scheme,
            Object.fromEntries(await Promise.all(this.#system_color_schemes.map(async system_color_scheme => {
                let _color_scheme = null;

                if ((system?.[system_color_scheme.name] ?? null) !== null) {
                    _color_scheme = await this.#getColorSchemeByName(
                        system[system_color_scheme.name]
                    );
                }

                if (_color_scheme === null) {
                    _color_scheme = await this.#getColorSchemeByName(
                        system_color_scheme["default-color-scheme"]
                    );
                }

                if (_color_scheme === null && this.#default_color_scheme !== COLOR_SCHEME_SYSTEM) {
                    _color_scheme = await this.#getColorSchemeByName(
                        this.#default_color_scheme
                    );
                }

                if (_color_scheme === null) {
                    throw new Error("Invalid color scheme");
                }

                return [
                    system_color_scheme.name,
                    _color_scheme
                ];
            })))
        ];
    }

    /**
     * @returns {Promise<string[]>}
     */
    async #getVariables() {
        return Array.from(new Set([
            COLOR_SCHEME_VARIABLE_ACCENT,
            COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND,
            COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND_RGB,
            COLOR_SCHEME_VARIABLE_ACCENT_RGB,
            COLOR_SCHEME_VARIABLE_BACKGROUND,
            COLOR_SCHEME_VARIABLE_BACKGROUND_RGB,
            COLOR_SCHEME_VARIABLE_FOREGROUND,
            COLOR_SCHEME_VARIABLE_FOREGROUND_RGB,
            ...this.#additional_variables
        ]));
    }

    /**
     * @returns {Promise<CSSStyleRule>}
     */
    async #getVariablesStyleSheetRule() {
        if (this.#variables_style_sheet_rule !== null) {
            const index = document.adoptedStyleSheets.indexOf(this.#variables_style_sheet_rule);
            if (index !== -1) {
                document.adoptedStyleSheets.splice(index, 1);
            }
            this.#variables_style_sheet_rule = null;
        }

        if (this.#variables_style_sheet_rule === null) {
            const style_sheet = new CSSStyleSheet();
            await style_sheet.replace(":root { }");
            [
                this.#variables_style_sheet_rule
            ] = style_sheet.cssRules;
            document.adoptedStyleSheets.push(style_sheet);
        }

        return this.#variables_style_sheet_rule;
    }

    /**
     * @param {boolean} is_system_color_scheme
     * @returns {Promise<void>}
     */
    async #initSystemColorSchemesDetectors(is_system_color_scheme) {
        if (is_system_color_scheme) {
            if (this.#init_system_color_scheme_detectors !== null) {
                return;
            }

            this.#init_system_color_scheme_detectors = () => {
                this.#render();
            };

            for (const system_color_scheme of this.#system_color_schemes) {
                system_color_scheme.detector.addEventListener("change", this.#init_system_color_scheme_detectors);
            }
        } else {
            if (this.#init_system_color_scheme_detectors === null) {
                return;
            }

            for (const system_color_scheme of this.#system_color_schemes) {
                system_color_scheme.detector.removeEventListener("change", this.#init_system_color_scheme_detectors);
            }

            this.#init_system_color_scheme_detectors = null;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const color_scheme = await this.getColorScheme();

        const variables_style_sheet_rule = await this.#getVariablesStyleSheetRule();
        for (const key of Array.from(variables_style_sheet_rule.style).filter(_key => _key.startsWith(COLOR_SCHEME_CSS_PROPERTY_PREFIX))) {
            variables_style_sheet_rule.style.removeProperty(key);
        }
        for (const variable of await this.#getVariables()) {
            variables_style_sheet_rule.style.setProperty(`${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${variable}`, `var(${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${color_scheme.name}-${variable})`);
        }

        const color_scheme_meta_element = document.head.querySelector("meta[name=color-scheme]") ?? document.createElement("meta");
        color_scheme_meta_element.content = color_scheme["color-scheme"] ?? COLOR_SCHEME_LIGHT;
        color_scheme_meta_element.name = "color-scheme";
        if (!color_scheme_meta_element.isConnected) {
            document.head.appendChild(color_scheme_meta_element);
        }

        const theme_color_meta_element = document.head.querySelector("meta[name=theme-color]") ?? document.createElement("meta");
        theme_color_meta_element.content = await this.getAccent();
        theme_color_meta_element.name = "theme-color";
        if (!theme_color_meta_element.isConnected) {
            document.head.appendChild(theme_color_meta_element);
        }
    }

    /**
     * @param {[ColorScheme, {[key: string]: ColorScheme}]} settings
     * @returns {Promise<void>}
     */
    async #setSettings(settings) {
        if (this.#flux_settings_api === null) {
            throw new Error("Missing FluxSettingsApi");
        }

        await this.#flux_settings_api.store(
            COLOR_SCHEME_SETTINGS_KEY,
            settings[0].name
        );

        if (this.#set_system_color_schemes) {
            await this.#flux_settings_api.store(
                COLOR_SCHEME_SYSTEM_SETTINGS_KEY,
                Object.fromEntries(Object.entries(settings[1]).map(([
                    name,
                    color_scheme
                ]) => [
                        name,
                        color_scheme.name
                    ]))
            );
        } else {
            await this.#flux_settings_api.delete(
                COLOR_SCHEME_SYSTEM_SETTINGS_KEY
            );
        }

        await this.#render();
    }
}
