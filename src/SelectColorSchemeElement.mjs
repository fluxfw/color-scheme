import { COLOR_SCHEME_SYSTEM } from "../COLOR_SCHEME.mjs";
import css from "./SelectColorSchemeElement.css" with { type: "css" };
import root_css from "./SelectColorSchemeElementRoot.css" with { type: "css" };
import { COLOR_SCHEME_VARIABLE_ACCENT_COLOR, COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR, COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR } from "../COLOR_SCHEME_VARIABLE.mjs";
import { COLOR_SCHEMES_VARIABLE_PREFIX } from "./COLOR_SCHEME_VARIABLE.mjs";

/** @typedef {import("./ColorSchemeObject.mjs").ColorSchemeObject} ColorSchemeObject */
/** @typedef {import("../Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("../StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */
/** @typedef {import("./SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

export const SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX = "--select-color-scheme-";

export class SelectColorSchemeElement extends HTMLElement {
    /**
     * @type {Localization}
     */
    #localization;
    /**
     * @type {boolean}
     */
    #set_system_color_schemes;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {boolean}
     */
    #show_color_scheme_accent_color;
    /**
     * @type {SystemColorScheme[]}
     */
    #system_color_schemes;

    /**
     * @param {ColorSchemeObject[]} color_schemes
     * @param {SystemColorScheme[]} system_color_schemes
     * @param {boolean} set_system_color_schemes
     * @param {boolean} show_color_scheme_accent_color
     * @param {[ColorSchemeObject, {[key: string]: ColorSchemeObject}]} settings
     * @param {(settings: [ColorSchemeObject, {[key: string]: ColorSchemeObject}]) => Promise<void>} store_settings
     * @param {Localization} localization
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<SelectColorSchemeElement>}
     */
    static async new(color_schemes, system_color_schemes, set_system_color_schemes, show_color_scheme_accent_color, settings, store_settings, localization, style_sheet_manager = null) {
        if (style_sheet_manager !== null) {
            await style_sheet_manager.generateVariablesRootStyleSheet(
                SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX,
                {
                    [`${SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX}background-color`]: "background-color",
                    [`${SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX}color-scheme-accent-color`]: "accent-color",
                    [`${SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX}color-scheme-background-color`]: "background-color",
                    [`${SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX}color-scheme-foreground-color`]: "foreground-color",
                    [`${SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX}color-scheme-outline-color`]: "foreground-color",
                    [`${SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX}foreground-color`]: "foreground-color"
                },
                true
            );

            await style_sheet_manager.addRootStyleSheet(
                root_css,
                true
            );
        } else {
            if (!document.adoptedStyleSheets.includes(root_css)) {
                document.adoptedStyleSheets.unshift(root_css);
            }
        }

        const select_color_scheme_element = new this(
            system_color_schemes,
            set_system_color_schemes,
            show_color_scheme_accent_color,
            localization
        );

        select_color_scheme_element.#shadow = select_color_scheme_element.attachShadow({
            mode: "closed"
        });

        await style_sheet_manager?.addStyleSheetsToShadow(
            select_color_scheme_element.#shadow
        );

        select_color_scheme_element.#shadow.adoptedStyleSheets.push(css);

        const color_schemes_element = document.createElement("div");
        color_schemes_element.classList.add("color_schemes");
        if (select_color_scheme_element.#show_color_scheme_accent_color) {
            color_schemes_element.dataset.show_accent_color = true;
        }
        await select_color_scheme_element.#render(
            color_schemes_element,
            color_schemes,
            settings,
            async color_scheme => {
                settings[0] = color_scheme;

                await store_settings(
                    settings
                );
            },
            store_settings
        );
        select_color_scheme_element.#shadow.append(color_schemes_element);

        return select_color_scheme_element;
    }

    /**
     * @param {SystemColorScheme[]} system_color_schemes
     * @param {boolean} set_system_color_schemes
     * @param {boolean} show_color_scheme_accent_color
     * @param {Localization} localization
     * @private
     */
    constructor(system_color_schemes, set_system_color_schemes, show_color_scheme_accent_color, localization) {
        super();

        this.#system_color_schemes = system_color_schemes;
        this.#set_system_color_schemes = set_system_color_schemes;
        this.#show_color_scheme_accent_color = show_color_scheme_accent_color;
        this.#localization = localization;
    }

    /**
     * @param {HTMLDivElement} parent_element
     * @param {ColorSchemeObject[]} color_schemes
     * @param {[ColorSchemeObject, {[key: string]: ColorSchemeObject}]} settings
     * @param {(color_scheme: ColorSchemeObject) => Promise<void>} set_color_scheme
     * @param {(settings: [ColorSchemeObject, {[key: string]: ColorSchemeObject}]) => Promise<void>} store_settings
     * @returns {Promise<void>}
     */
    async #render(parent_element, color_schemes, settings, set_color_scheme, store_settings) {
        const variables = [
            COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR,
            COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR
        ];

        for (const color_scheme of color_schemes) {
            const color_scheme_element = document.createElement("button");
            color_scheme_element.classList.add("color_scheme");
            if (color_scheme.name === settings[0].name) {
                color_scheme_element.dataset.selected = true;
            }
            color_scheme_element.title = await color_scheme.label(
                this.#localization
            );
            color_scheme_element.type = "button";

            if (color_scheme.name === COLOR_SCHEME_SYSTEM) {
                color_scheme_element.dataset.system = true;

                const use_in_color_schemes = this.#system_color_schemes.filter(system_color_scheme => system_color_scheme["use-in-color-scheme"]);

                const values = {
                    [COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR]: use_in_color_schemes.shift()?.["default-color-scheme"] ?? null,
                    [COLOR_SCHEME_VARIABLE_FOREGROUND_COLOR]: use_in_color_schemes.shift()?.["default-color-scheme"] ?? null
                };

                for (const variable of variables) {
                    if (values[variable] === null) {
                        continue;
                    }

                    color_scheme_element.style.setProperty(`${SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX}color-scheme-${variable}`, `var(${COLOR_SCHEMES_VARIABLE_PREFIX}${values[variable]}-${COLOR_SCHEME_VARIABLE_BACKGROUND_COLOR})`);
                }
            } else {
                for (const variable of [
                    ...this.#show_color_scheme_accent_color ? [
                        COLOR_SCHEME_VARIABLE_ACCENT_COLOR
                    ] : [],
                    ...variables
                ]) {
                    color_scheme_element.style.setProperty(`${SELECT_COLOR_SCHEME_ELEMENT_VARIABLE_PREFIX}color-scheme-${variable}`, `var(${COLOR_SCHEMES_VARIABLE_PREFIX}${color_scheme.name}-${variable})`);
                }
            }

            color_scheme_element.addEventListener("click", async () => {
                if (color_scheme_element.dataset.selected === "true") {
                    return;
                }

                parent_element.querySelectorAll(".color_scheme[data-selected]").forEach(_color_scheme_element => {
                    delete _color_scheme_element.dataset.selected;
                });

                color_scheme_element.dataset.selected = true;

                await set_color_scheme(
                    color_scheme
                );

                await this.#updateSystemColorSchemeSelector(
                    parent_element,
                    color_schemes,
                    settings,
                    store_settings
                );
            });

            parent_element.append(color_scheme_element);
        }

        await this.#updateSystemColorSchemeSelector(
            parent_element,
            color_schemes,
            settings,
            store_settings
        );
    }

    /**
     * @param {HTMLDivElement} parent_element
     * @param {ColorSchemeObject[]} color_schemes
     * @param {[ColorSchemeObject, {[key: string]: ColorSchemeObject}]} settings
     * @param {(settings: [ColorSchemeObject, {[key: string]: ColorSchemeObject}]) => Promise<void>} store_settings
     * @returns {Promise<void>}
     */
    async #updateSystemColorSchemeSelector(parent_element, color_schemes, settings, store_settings) {
        if (!this.#set_system_color_schemes) {
            return;
        }

        Array.from(parent_element.querySelectorAll("[data-system_selector]")).forEach(system_selector_element => {
            system_selector_element.remove();
        });

        if (settings[0].name !== COLOR_SCHEME_SYSTEM) {
            return;
        }

        for (const system_color_scheme of this.#system_color_schemes) {
            const title_element = document.createElement("div");
            title_element.classList.add("title");
            title_element.dataset.system_selector = true;
            title_element.innerText = await system_color_scheme.label(
                this.#localization
            );
            parent_element.append(title_element);

            const color_schemes_element = document.createElement("div");
            color_schemes_element.classList.add("color_schemes");
            color_schemes_element.dataset.system_selector = true;
            await this.#render(
                color_schemes_element,
                color_schemes.filter(color_scheme => color_scheme.name !== COLOR_SCHEME_SYSTEM),
                [
                    settings[1][system_color_scheme.name],
                    {}
                ],
                async color_scheme => {
                    settings[1][system_color_scheme.name] = color_scheme;

                    await store_settings(
                        settings
                    );
                },
                store_settings
            );
            parent_element.append(color_schemes_element);
        }
    }
}

export const SELECT_COLOR_SCHEME_ELEMENT_TAG_NAME = "select-color-scheme";

customElements.define(SELECT_COLOR_SCHEME_ELEMENT_TAG_NAME, SelectColorSchemeElement);
