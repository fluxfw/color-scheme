import { COLOR_SCHEME_SYSTEM } from "./SYSTEM_COLOR_SCHEME.mjs";
import root_css from "./ColorSchemeRoot.css" with { type: "css" };
import shadow_css from "./ColorSchemeShadow.css" with { type: "css" };
import { COLOR_SCHEME_VARIABLE_ACCENT_COLOR, COLOR_SCHEME_VARIABLE_ACCENT_COLOR_RGB, COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND_COLOR, COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND_COLOR_RGB, COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR, COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR_RGB, COLOR_SCHEME_VARIABLE_COLOR_SCHEME, COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR, COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR_RGB, COLOR_SCHEME_VARIABLE_RGB_SUFFIX, COLOR_SCHEMES_VARIABLE_PREFIX, DEFAULT_COLOR_SCHEME_VARIABLES, RENDER_COLOR_SCHEME_VARIABLE_PREFIX } from "./COLOR_SCHEME_VARIABLE.mjs";
import { SETTINGS_STORAGE_KEY_COLOR_SCHEME, SETTINGS_STORAGE_KEY_COLOR_SCHEME_SYSTEM } from "./SettingsStorage/SETTINGS_STORAGE_KEY.mjs";

/** @typedef {import("button-group/src/ButtonGroupElement.mjs").ButtonGroupElement} ButtonGroupElement */
/** @typedef {import("./ColorSchemeObject.mjs").ColorSchemeObject} ColorSchemeObject */
/** @typedef {import("./ColorSchemeValue.mjs").ColorSchemeValue} ColorSchemeValue */
/** @typedef {import("form/src/InputElement.mjs").InputElement} InputElement */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./SettingsStorage/SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */
/** @typedef {import("./SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

export const COLOR_SCHEME_EVENT_CHANGE = "color-scheme-change";

export const COLOR_SCHEME_VARIABLE_PREFIX = "--color-scheme-";

export class ColorScheme extends EventTarget {
    /**
     * @type {{name: string | null, system_names: {[key: string]: string}}}
     */
    #color_scheme;
    /**
     * @type {ColorSchemeObject[]}
     */
    #color_schemes;
    /**
     * @type {Localization | null}
     */
    #localization;
    /**
     * @type {Document | ShadowRoot}
     */
    #root;
    /**
     * @type {SettingsStorage | null}
     */
    #settings_storage;
    /**
     * @type {CSSStyleRule | null}
     */
    #style_sheet_rule = null;
    /**
     * @type {SystemColorScheme[]}
     */
    #system_color_schemes;
    /**
     * @type {AbortController | null}
     */
    #system_detector_abort_controller = null;
    /**
     * @type {string[]}
     */
    #variables;

    /**
     * @param {Document | ShadowRoot | null} root
     * @param {Localization | null} localization
     * @param {SettingsStorage | null} settings_storage
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<ColorScheme>}
     */
    static async new(root = null, localization = null, settings_storage = null, style_sheet_manager = null) {
        const _root = root ?? document;

        if (style_sheet_manager !== null) {
            await style_sheet_manager.addRoot(
                _root
            );

            await style_sheet_manager.generateVariablesRootStyleSheet(
                COLOR_SCHEME_VARIABLE_PREFIX,
                {
                    [`${COLOR_SCHEME_VARIABLE_PREFIX}accent-color`]: "accent-color",
                    [`${COLOR_SCHEME_VARIABLE_PREFIX}accent-color-rgb`]: "accent-color-rgb",
                    [`${COLOR_SCHEME_VARIABLE_PREFIX}accent-foreground-color`]: "accent-foreground-color",
                    [`${COLOR_SCHEME_VARIABLE_PREFIX}background-color`]: "background-color",
                    [`${COLOR_SCHEME_VARIABLE_PREFIX}color-scheme`]: "color-scheme",
                    [`${COLOR_SCHEME_VARIABLE_PREFIX}foreground-color`]: "foreground-color"
                },
                true
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

        const color_scheme = new this(
            _root,
            Array.from(DEFAULT_COLOR_SCHEME_VARIABLES),
            localization,
            settings_storage
        );

        color_scheme.#color_scheme = await color_scheme.#getColorScheme();

        return color_scheme;
    }

    /**
     * @param {Document | ShadowRoot} root
     * @param {string[]} variables
     * @param {Localization | null} localization
     * @param {SettingsStorage | null} settings_storage
     * @private
     */
    constructor(root, variables, localization, settings_storage) {
        super();

        this.#root = root;
        this.#localization = localization;
        this.#settings_storage = settings_storage;
        this.#color_schemes = [];
        this.#system_color_schemes = [];
        this.#variables = variables;
    }

    /**
     * @param {ColorSchemeObject} color_scheme
     * @returns {Promise<void>}
     */
    async addColorScheme(color_scheme) {
        if (this.#color_schemes.some(_color_scheme => _color_scheme.name === color_scheme.name)) {
            throw new Error(`Color scheme with name ${color_scheme.name} already exists!`);
        }

        this.#color_schemes.push(color_scheme);

        if (!(this.#color_scheme.name !== null ? this.#color_scheme.name === color_scheme.name : color_scheme.default ?? false)) {
            return;
        }

        await this.#render();
    }

    /**
     * @param {SystemColorScheme} system_color_scheme
     * @returns {Promise<void>}
     */
    async addSystemColorScheme(system_color_scheme) {
        if (this.#system_color_schemes.some(_system_color_scheme => _system_color_scheme.name === system_color_scheme.name)) {
            throw new Error(`System color scheme with name ${system_color_scheme.name} already exists!`);
        }

        this.#system_color_schemes.push(system_color_scheme);
    }

    /**
     * @param {string} variable
     * @returns {Promise<void>}
     */
    async addVariable(variable) {
        if (this.#variables.includes(variable)) {
            throw new Error(`Variable ${variable} already exists!`);
        }

        this.#variables.push(variable);
    }

    /**
     * @param {string | null} name
     * @returns {Promise<ColorSchemeValue>}
     */
    async getColorScheme(name = null) {
        const names = Array.from(new Set([
            name,
            this.#color_scheme.name,
            this.#getDefaultColorScheme(
                true
            )?.name ?? null,
            this.#getDefaultColorScheme(
                false
            )?.name ?? null
        ].filter(_name => _name !== null)));

        let color_scheme = names.reduce((_color_scheme, _name) => _color_scheme ?? this.#getColorSchemeByName(
            _name
        ), null);

        if (color_scheme === null) {
            throw new Error(`No color scheme${names.length > 0 ? `s for name${names.length > 1 ? "s" : ""} ${names.join(", ")}` : ""}!`);
        }

        let system = null;

        if (color_scheme.name === COLOR_SCHEME_SYSTEM) {
            system = this.#getCurrentSystemColorScheme();

            if (system === null) {
                throw new Error("No current system color scheme!");
            }

            const _names = Array.from(new Set([
                this.#color_scheme.system_names[system.name] ?? null,
                system.default ?? null,
                this.#getDefaultColorScheme(
                    false
                )?.name ?? null
            ].filter(_name => _name !== null)));

            color_scheme = _names.reduce((_color_scheme, _name) => _color_scheme ?? this.#getColorSchemeByName(
                _name
            ), null);

            if (color_scheme === null) {
                throw new Error(`No color scheme${_names.length > 0 ? `s for name${_names.length > 1 ? "s" : ""} ${_names.join(", ")} and` : ""} for system color scheme ${system.name}!`);
            }
        }

        return {
            label: await this.#getLabel(
                color_scheme
            ),
            name: color_scheme.name,
            system: system !== null ? {
                label: await this.#getLabel(
                    system
                ),
                name: system.name
            } : null
        };
    }

    /**
     * @param {boolean | null} exclude_system
     * @returns {Promise<{[key: string]: string}>}
     */
    async getColorSchemes(exclude_system = null) {
        const _exclude_system = exclude_system ?? false;

        const system_label = !_exclude_system ? (await this.getColorScheme(
            COLOR_SCHEME_SYSTEM
        )).system.label : null;

        const color_schemes = {};

        for (const color_scheme of this.#color_schemes) {
            if (_exclude_system && color_scheme.name === COLOR_SCHEME_SYSTEM) {
                continue;
            }

            color_schemes[color_scheme.name] = await this.#getLabel(
                color_scheme,
                system_label
            );
        }

        return Object.fromEntries(Object.entries(color_schemes).sort(([
            name_1,
            label_1
        ], [
            name_2,
            label_2
        ]) => {
            const system_1 = name_1 === COLOR_SCHEME_SYSTEM ? 0 : 1;
            const system_2 = name_2 === COLOR_SCHEME_SYSTEM ? 0 : 1;

            if (system_1 > system_2) {
                return 1;
            }

            if (system_1 < system_2) {
                return -1;
            }

            const _label_1 = label_1.toLowerCase();
            const _label_2 = label_2.toLowerCase();

            if (_label_1 > _label_2) {
                return 1;
            }

            if (_label_1 < _label_2) {
                return -1;
            }

            return 0;
        }));
    }

    /**
     * @returns {Promise<{[key: string]: string}>}
     */
    async getSystemColorSchemes() {
        const system_color_schemes = {};

        for (const system_color_scheme of this.#system_color_schemes) {
            system_color_schemes[system_color_scheme.name] = await this.#getLabel(
                system_color_scheme
            );
        }

        return Object.fromEntries(Object.entries(system_color_schemes).sort(([
            ,
            label_1
        ], [
            ,
            label_2
        ]) => {
            const _label_1 = label_1.toLowerCase();
            const _label_2 = label_2.toLowerCase();

            if (_label_1 > _label_2) {
                return 1;
            }

            if (_label_1 < _label_2) {
                return -1;
            }

            return 0;
        }));
    }

    /**
     * @returns {Promise<{[key: string]: string | null}>}
     */
    async getSystemColorSchemesNames() {
        const system_names = {};

        for (const system_color_scheme of this.#system_color_schemes) {
            system_names[system_color_scheme.name] = this.#color_scheme.system_names[system_color_scheme.name] ?? system_color_scheme.default ?? null;
        }

        return system_names;
    }

    /**
     * @param {string} variable
     * @returns {Promise<string>}
     */
    async getVariable(variable) {
        return getComputedStyle(this.#root instanceof Document ? this.#root.documentElement : this.#root.host).getPropertyValue(`${RENDER_COLOR_SCHEME_VARIABLE_PREFIX}${variable}`).trim();
    }

    /**
     * @returns {Promise<string>}
     */
    async getVariableAccentColorRgb() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_COLOR_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getVariableAccentColor() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_COLOR
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getVariableAccentForegroundColorRgb() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND_COLOR_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getVariableAccentForegroundColor() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_ACCENT_FOREGROUND_COLOR
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getVariableBackgroundColorRgb() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getVariableBackgroundColor() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getVariableColorScheme() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_COLOR_SCHEME
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getVariableForegroundColorRgb() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR_RGB
        );
    }

    /**
     * @returns {Promise<string>}
     */
    async getVariableForegroundColor() {
        return this.getVariable(
            COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR
        );
    }

    /**
     * @param {string | null} name
     * @returns {Promise<void>}
     */
    async setColorScheme(name = null) {
        this.#color_scheme.name = name;

        await this.#settings_storage?.store(
            SETTINGS_STORAGE_KEY_COLOR_SCHEME,
            this.#color_scheme.name
        );

        await this.#render();
    }

    /**
     * @param {{[key: string]: string} | null} system_names
     * @returns {Promise<void>}
     */
    async setSystemColorSchemes(system_names = null) {
        this.#color_scheme.system_names = structuredClone(system_names ?? {});

        await this.#settings_storage?.store(
            SETTINGS_STORAGE_KEY_COLOR_SCHEME_SYSTEM,
            this.#color_scheme.system_names
        );

        await this.#render();
    }

    /**
     * @returns {Promise<{name: string | null, system_names: {[key: string]: string}}>}
     */
    async #getColorScheme() {
        return {
            name: await this.#settings_storage?.get(
                SETTINGS_STORAGE_KEY_COLOR_SCHEME
            ) ?? null,
            system_names: await this.#settings_storage?.get(
                SETTINGS_STORAGE_KEY_COLOR_SCHEME_SYSTEM
            ) ?? {}
        };
    }

    /**
     * @param {string} name
     * @returns {ColorSchemeObject | null}
     */
    #getColorSchemeByName(name) {
        return this.#color_schemes.find(color_scheme => color_scheme.name === name) ?? null;
    }

    /**
     * @returns {SystemColorScheme | null}
     */
    #getCurrentSystemColorScheme() {
        return this.#system_color_schemes.find(system_color_scheme => system_color_scheme.detector.matches) ?? null;
    }

    /**
     * @param {boolean} system
     * @returns {ColorSchemeObject | null}
     */
    #getDefaultColorScheme(system) {
        return this.#color_schemes.find(color_scheme => (color_scheme.default ?? false) && (color_scheme.name === COLOR_SCHEME_SYSTEM) === system) ?? null;
    }

    /**
     * @param {ColorSchemeObject} color_scheme
     * @param {string | null} system_label
     * @returns {Promise<string>}
     */
    async #getLabel(color_scheme, system_label = null) {
        return ((color_scheme.label ?? null) !== null ? typeof color_scheme.label === "function" ? await color_scheme.label(
            this.#localization,
            system_label
        ) : typeof color_scheme.label === "object" ? this.#localization?.translateStatic(
            color_scheme.label
        ) ?? null : color_scheme.label : null) ?? color_scheme.name;
    }

    /**
     * @returns {CSSStyleRule}
     */
    #getStyleSheetRule() {
        if (this.#style_sheet_rule !== null) {
            const index = this.#root.adoptedStyleSheets.indexOf(this.#style_sheet_rule.parentStyleSheet);
            if (index !== -1) {
                this.#root.adoptedStyleSheets.splice(index, 1);
            }
            this.#style_sheet_rule = null;
        }

        if (this.#style_sheet_rule === null) {
            const style_sheet = new CSSStyleSheet();
            this.#style_sheet_rule = style_sheet.cssRules[style_sheet.insertRule(":root, :host {}")];
            this.#root.adoptedStyleSheets.push(style_sheet);
        }

        return this.#style_sheet_rule;
    }

    /**
     * @param {ColorSchemeValue} color_scheme
     * @returns {void}
     */
    #initSystemDetector(color_scheme) {
        if (color_scheme.system !== null) {
            if (this.#system_detector_abort_controller !== null) {
                return;
            }

            this.#system_detector_abort_controller = new AbortController();

            for (const system_color_scheme of this.#system_color_schemes) {
                system_color_scheme.detector.addEventListener("change", async () => {
                    await this.#render();
                }, {
                    signal: this.#system_detector_abort_controller.signal
                });
            }
        } else {
            if (this.#system_detector_abort_controller === null) {
                return;
            }

            this.#system_detector_abort_controller.abort();

            this.#system_detector_abort_controller = null;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const color_scheme = await this.getColorScheme();

        this.#initSystemDetector(
            color_scheme
        );

        const style_sheet_rule = this.#getStyleSheetRule();

        for (const key of Array.from(style_sheet_rule.style).filter(_key => [
            COLOR_SCHEMES_VARIABLE_PREFIX,
            RENDER_COLOR_SCHEME_VARIABLE_PREFIX
        ].some(prefix => _key.startsWith(prefix)))) {
            style_sheet_rule.style.removeProperty(key);
        }

        for (const variable of this.#variables) {
            if (variable.endsWith(COLOR_SCHEME_VARIABLE_RGB_SUFFIX)) {
                const _variable = variable.slice(0, -COLOR_SCHEME_VARIABLE_RGB_SUFFIX.length);

                if (!this.#variables.includes(_variable)) {
                    for (const _color_scheme of this.#color_schemes.filter(__color_scheme => __color_scheme.name !== COLOR_SCHEME_SYSTEM)) {
                        style_sheet_rule.style.setProperty(`${COLOR_SCHEMES_VARIABLE_PREFIX}${_color_scheme.name}-${_variable}`, `rgb(var(${COLOR_SCHEMES_VARIABLE_PREFIX}${_color_scheme.name}-${variable}))`);
                    }

                    style_sheet_rule.style.setProperty(`${RENDER_COLOR_SCHEME_VARIABLE_PREFIX}${_variable}`, `var(${COLOR_SCHEMES_VARIABLE_PREFIX}${color_scheme.name}-${_variable})`);
                }
            }

            style_sheet_rule.style.setProperty(`${RENDER_COLOR_SCHEME_VARIABLE_PREFIX}${variable}`, `var(${COLOR_SCHEMES_VARIABLE_PREFIX}${color_scheme.name}-${variable})`);
        }

        if (this.#root instanceof Document) {
            const theme_color_meta_element = this.#root.head.querySelector("meta[name=theme-color]") ?? this.#root.createElement("meta");
            theme_color_meta_element.content = await this.getVariableAccentColor();
            if (!theme_color_meta_element.isConnected) {
                theme_color_meta_element.name = "theme-color";
                this.#root.head.append(theme_color_meta_element);
            }
        }

        this.dispatchEvent(new CustomEvent(COLOR_SCHEME_EVENT_CHANGE, {
            detail: {
                color_scheme
            }
        }));
    }
}
