import { COLOR_SCHEME_SYSTEM } from "./ColorScheme/COLOR_SCHEME.mjs";
import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATIONS } from "./Localization/LOCALIZATIONS.mjs";
import root_css from "./ColorScheme/FluxColorSchemeRoot.css" with { type: "css" };
import shadow_css from "./ColorScheme/FluxColorSchemeShadow.css" with { type: "css" };
import { COLOR_SCHEME_VARIABLE_ACCENT_COLOR, COLOR_SCHEME_VARIABLE_ACCENT_COLOR_FOREGROUND_COLOR, COLOR_SCHEME_VARIABLE_ACCENT_COLOR_FOREGROUND_COLOR_RGB, COLOR_SCHEME_VARIABLE_ACCENT_COLOR_RGB, COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR, COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR_RGB, COLOR_SCHEME_VARIABLE_COLOR_SCHEME, COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR, COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR_RGB, COLOR_SCHEME_VARIABLE_PREFIX, COLOR_SCHEME_VARIABLE_RGB_SUFFIX, DEFAULT_COLOR_SCHEME_VARIABLES } from "./ColorScheme/COLOR_SCHEME_VARIABLE.mjs";
import { DEFAULT_COLOR_SCHEMES, DEFAULT_SYSTEM_COLOR_SCHEMES } from "./ColorScheme/DEFAULT_COLOR_SCHEMES.mjs";
import { SETTINGS_STORAGE_KEY_COLOR_SCHEME, SETTINGS_STORAGE_KEY_COLOR_SCHEME_SYSTEM } from "./SettingsStorage/SETTINGS_STORAGE_KEY.mjs";

/** @typedef {import("./ColorScheme/ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("./ColorScheme/ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("./ColorScheme/FluxSelectColorSchemeElement.mjs").FluxSelectColorSchemeElement} FluxSelectColorSchemeElement */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./SettingsStorage/SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */
/** @typedef {import("./ColorScheme/SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

export class FluxColorScheme {
    /**
     * @type {ColorScheme[]}
     */
    #color_schemes;
    /**
     * @type {string}
     */
    #default_color_scheme;
    /**
     * @type {(() => Promise<void>) | null}
     */
    #init_system_color_scheme_detectors = null;
    /**
     * @type {Localization | null}
     */
    #localization;
    /**
     * @type {Document | ShadowRoot}
     */
    #root;
    /**
     * @type {boolean}
     */
    #set_system_color_schemes;
    /**
     * @type {SettingsStorage | null}
     */
    #settings_storage;
    /**
     * @type {boolean}
     */
    #show_color_scheme_accent_color;
    /**
     * @type {StyleSheetManager | null}
     */
    #style_sheet_manager;
    /**
     * @type {CSSStyleRule | null}
     */
    #style_sheet_rule = null;
    /**
     * @type {SystemColorScheme[]}
     */
    #system_color_schemes;
    /**
     * @type {string[]}
     */
    #variables;

    /**
     * @param {Document | ShadowRoot | null} root
     * @param {ColorScheme[] | null} color_schemes
     * @param {string | null} default_color_scheme
     * @param {string[] | null} variables
     * @param {SystemColorScheme[] | null} system_color_schemes
     * @param {boolean | null} set_system_color_schemes
     * @param {boolean | null} show_color_scheme_accent_color
     * @param {Localization | null} localization
     * @param {SettingsStorage | null} settings_storage
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FluxColorScheme>}
     */
    static async new(root = null, color_schemes = null, default_color_scheme = null, variables = null, system_color_schemes = null, set_system_color_schemes = null, show_color_scheme_accent_color = null, localization = null, settings_storage = null, style_sheet_manager = null) {
        const _root = root ?? document;

        if (style_sheet_manager !== null) {
            await style_sheet_manager.addRoot(
                _root
            );

            await style_sheet_manager.addShadowStyleSheet(
                shadow_css,
                true
            );

            await style_sheet_manager.addRootStyleSheet(
                root_css,
                true
            );
        } else {
            if (!_root.adoptedStyleSheets.includes(shadow_css)) {
                _root.adoptedStyleSheets.unshift(shadow_css);
            }

            if (!_root.adoptedStyleSheets.includes(root_css)) {
                _root.adoptedStyleSheets.unshift(root_css);
            }
        }

        const _color_schemes = color_schemes ?? DEFAULT_COLOR_SCHEMES;

        const flux_color_scheme = new this(
            _root,
            _color_schemes,
            default_color_scheme ?? (_color_schemes.some(color_scheme => color_scheme.name === COLOR_SCHEME_SYSTEM) ? null : _color_schemes[0]?.name ?? null) ?? COLOR_SCHEME_SYSTEM,
            variables ?? DEFAULT_COLOR_SCHEME_VARIABLES,
            system_color_schemes ?? DEFAULT_SYSTEM_COLOR_SCHEMES,
            set_system_color_schemes ?? false,
            show_color_scheme_accent_color ?? false,
            localization,
            settings_storage,
            style_sheet_manager
        );

        if (flux_color_scheme.#localization !== null) {
            await flux_color_scheme.#localization.addModule(
                LOCALIZATION_MODULE,
                LOCALIZATIONS
            );
        }

        await flux_color_scheme.#render();

        return flux_color_scheme;
    }

    /**
     * @param {Document | ShadowRoot} root
     * @param {ColorScheme[]} color_schemes
     * @param {string} default_color_scheme
     * @param {string[]} variables
     * @param {SystemColorScheme[]} system_color_schemes
     * @param {boolean} set_system_color_schemes
     * @param {boolean} show_color_scheme_accent_color
     * @param {Localization | null} localization
     * @param {SettingsStorage | null} settings_storage
     * @param {StyleSheetManager | null} style_sheet_manager
     * @private
     */
    constructor(root, color_schemes, default_color_scheme, variables, system_color_schemes, set_system_color_schemes, show_color_scheme_accent_color, localization, settings_storage, style_sheet_manager) {
        this.#root = root;
        this.#color_schemes = color_schemes;
        this.#default_color_scheme = default_color_scheme;
        this.#variables = variables;
        this.#system_color_schemes = system_color_schemes;
        this.#set_system_color_schemes = set_system_color_schemes;
        this.#show_color_scheme_accent_color = show_color_scheme_accent_color;
        this.#localization = localization;
        this.#settings_storage = settings_storage;
        this.#style_sheet_manager = style_sheet_manager;
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentColorForegroundColorRgbVariable() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_COLOR_FOREGROUND_COLOR_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentColorForegroundColorVariable() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_COLOR_FOREGROUND_COLOR
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentColorRgbVariable() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_COLOR_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getAccentColorVariable() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_COLOR
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackgroundColorRgbVariable() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getBackgroundColorVariable() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR
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
            "system-color-scheme": system_color_scheme
        };
    }

    /**
     * @returns {Promise<string>}
     */
    async getColorSchemeVariable() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_COLOR_SCHEME
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getForegroundColorRgbVariable() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getForegroundColorVariable() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR
        );
    }

    /**
     * @returns {Promise<FluxSelectColorSchemeElement>}
     */
    async getSelectColorSchemeElement() {
        if (this.#localization === null) {
            throw new Error("Missing Localization");
        }

        return (await import("./ColorScheme/FluxSelectColorSchemeElement.mjs")).FluxSelectColorSchemeElement.new(
            this.#color_schemes,
            this.#system_color_schemes,
            this.#set_system_color_schemes,
            this.#show_color_scheme_accent_color,
            await this.#getSettings(),
            async settings => {
                await this.#storeSettings(
                    settings
                );
            },
            this.#localization,
            this.#style_sheet_manager
        );
    }

    /**
     * @param {string} variable
     * @returns {Promise<string>}
     */
    async getVariable(variable) {
        return getComputedStyle(this.#root instanceof Document ? this.#root.documentElement : this.#root.host).getPropertyValue(`${COLOR_SCHEME_VARIABLE_PREFIX}${variable}`).trim();
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

        const name = await this.#settings_storage?.get(
            SETTINGS_STORAGE_KEY_COLOR_SCHEME
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

        const system = this.#set_system_color_schemes ? await this.#settings_storage?.get(
            SETTINGS_STORAGE_KEY_COLOR_SCHEME_SYSTEM
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
     * @returns {Promise<CSSStyleRule>}
     */
    async #getStyleSheetRule() {
        if (this.#style_sheet_rule !== null) {
            const index = this.#root.adoptedStyleSheets.indexOf(this.#style_sheet_rule.parentStyleSheet);
            if (index !== -1) {
                this.#root.adoptedStyleSheets.splice(index, 1);
            }
            this.#style_sheet_rule = null;
        }

        if (this.#style_sheet_rule === null) {
            const style_sheet = new CSSStyleSheet();
            this.#style_sheet_rule = style_sheet.cssRules[style_sheet.insertRule(":root, :host { }")];
            this.#root.adoptedStyleSheets.push(style_sheet);
        }

        return this.#style_sheet_rule;
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

            this.#init_system_color_scheme_detectors = async () => {
                await this.#render();
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

        const style_sheet_rule = await this.#getStyleSheetRule();

        for (const key of Array.from(style_sheet_rule.style).filter(_key => _key.startsWith(COLOR_SCHEME_VARIABLE_PREFIX))) {
            style_sheet_rule.style.removeProperty(key);
        }

        for (const variable of this.#variables) {
            if (variable.endsWith(COLOR_SCHEME_VARIABLE_RGB_SUFFIX)) {
                const _variable = variable.slice(0, -COLOR_SCHEME_VARIABLE_RGB_SUFFIX.length);

                if (!this.#variables.includes(_variable)) {
                    for (const _color_scheme of this.#color_schemes.filter(__color_scheme => __color_scheme.name !== COLOR_SCHEME_SYSTEM)) {
                        style_sheet_rule.style.setProperty(`${COLOR_SCHEME_VARIABLE_PREFIX}${_color_scheme.name}-${_variable}`, `rgb(var(${COLOR_SCHEME_VARIABLE_PREFIX}${_color_scheme.name}-${variable}))`);
                    }

                    style_sheet_rule.style.setProperty(`${COLOR_SCHEME_VARIABLE_PREFIX}${_variable}`, `var(${COLOR_SCHEME_VARIABLE_PREFIX}${color_scheme.name}-${_variable})`);
                }
            }

            style_sheet_rule.style.setProperty(`${COLOR_SCHEME_VARIABLE_PREFIX}${variable}`, `var(${COLOR_SCHEME_VARIABLE_PREFIX}${color_scheme.name}-${variable})`);
        }

        if (this.#root instanceof Document) {
            const theme_color_meta_element = this.#root.head.querySelector("meta[name=theme-color]") ?? this.#root.createElement("meta");
            theme_color_meta_element.content = await this.getAccentColorVariable();
            theme_color_meta_element.name = "theme-color";
            if (!theme_color_meta_element.isConnected) {
                this.#root.head.append(theme_color_meta_element);
            }
        }
    }

    /**
     * @param {[ColorScheme, {[key: string]: ColorScheme}]} settings
     * @returns {Promise<void>}
     */
    async #storeSettings(settings) {
        if (this.#settings_storage === null) {
            throw new Error("Missing SettingsStorage");
        }

        await this.#settings_storage.store(
            SETTINGS_STORAGE_KEY_COLOR_SCHEME,
            settings[0].name
        );

        if (this.#set_system_color_schemes) {
            await this.#settings_storage.store(
                SETTINGS_STORAGE_KEY_COLOR_SCHEME_SYSTEM,
                Object.fromEntries(Object.entries(settings[1]).map(([
                    name,
                    color_scheme
                ]) => [
                        name,
                        color_scheme.name
                    ]))
            );
        } else {
            await this.#settings_storage.delete(
                SETTINGS_STORAGE_KEY_COLOR_SCHEME_SYSTEM
            );
        }

        await this.#render();
    }
}
