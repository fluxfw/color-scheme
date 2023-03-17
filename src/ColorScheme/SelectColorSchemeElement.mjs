import { COLOR_SCHEME_CSS_PROPERTY_PREFIX } from "./COLOR_SCHEME_CSS_PROPERTY_PREFIX.mjs";
import { COLOR_SCHEME_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT } from "./COLOR_SCHEME.mjs";

/** @typedef {import("./ColorScheme.mjs").ColorScheme} ColorScheme */
/** @typedef {import("./ColorSchemeWithSystemColorScheme.mjs").ColorSchemeWithSystemColorScheme} ColorSchemeWithSystemColorScheme */
/** @typedef {import("../../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./setColorScheme.mjs").setColorScheme} setColorScheme */
/** @typedef {import("./SystemColorScheme.mjs").SystemColorScheme} SystemColorScheme */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class SelectColorSchemeElement extends HTMLElement {
    /**
     * @type {ColorSchemeWithSystemColorScheme}
     */
    #color_scheme;
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
     * @type {setColorScheme}
     */
    #set;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {SystemColorScheme | null}
     */
    #system_color_schemes;
    /**
     * @type {string[]}
     */
    #variables;

    /**
     * @param {ColorSchemeWithSystemColorScheme} color_scheme
     * @param {ColorScheme[]} color_schemes
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {setColorScheme} set
     * @param {string[]} variables
     * @param {SystemColorScheme | null} system_color_schemes
     * @returns {SelectColorSchemeElement}
     */
    static new(color_scheme, color_schemes, flux_css_api, flux_localization_api, set, variables, system_color_schemes = null) {
        return new this(
            color_scheme,
            color_schemes,
            flux_css_api,
            flux_localization_api,
            set,
            variables,
            system_color_schemes
        );
    }

    /**
     * @param {ColorSchemeWithSystemColorScheme} color_scheme
     * @param {ColorScheme[]} color_schemes
     * @param {FluxCssApi} flux_css_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {setColorScheme} set
     * @param {string[]} variables
     * @param {SystemColorScheme | null} system_color_schemes
     * @private
     */
    constructor(color_scheme, color_schemes, flux_css_api, flux_localization_api, set, variables, system_color_schemes) {
        super();

        this.#color_scheme = color_scheme;
        this.#color_schemes = color_schemes;
        this.#flux_css_api = flux_css_api;
        this.#flux_localization_api = flux_localization_api;
        this.#set = set;
        this.#variables = variables;
        this.#system_color_schemes = system_color_schemes;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#flux_css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {void}
     */
    #removeSelection() {
        for (const color_scheme_element of this.#shadow.querySelectorAll(".color_scheme[data-selected]")) {
            delete color_scheme_element.dataset.selected;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = await this.#flux_localization_api.translate(
            "Color scheme",
            COLOR_SCHEME_LOCALIZATION_MODULE
        );
        this.#shadow.appendChild(title);

        const color_schemes_element = document.createElement("div");
        color_schemes_element.classList.add("color_schemes");

        if (this.#system_color_schemes !== null) {
            const system_color_scheme_element = document.createElement("button");
            system_color_scheme_element.classList.add("color_scheme");
            system_color_scheme_element.dataset.system = true;
            system_color_scheme_element.title = await this.#flux_localization_api.translate(
                "Use system color scheme ({light_color_scheme}/{dark_color_scheme})",
                COLOR_SCHEME_LOCALIZATION_MODULE,
                {
                    light_color_scheme: this.#system_color_schemes[COLOR_SCHEME_LIGHT],
                    dark_color_scheme: this.#system_color_schemes[COLOR_SCHEME_DARK]
                }
            );
            system_color_scheme_element.type = "button";

            if (this.#color_scheme.system_color_scheme) {
                system_color_scheme_element.dataset.selected = true;
            }

            system_color_scheme_element.addEventListener("click", () => {
                if (system_color_scheme_element.dataset.selected) {
                    return;
                }

                this.#removeSelection();

                system_color_scheme_element.dataset.selected = true;

                this.#set(
                    ""
                );
            });

            color_schemes_element.appendChild(system_color_scheme_element);
        }

        for (const color_scheme of this.#color_schemes) {
            const color_scheme_element = document.createElement("button");
            color_scheme_element.classList.add("color_scheme");
            for (const variable of this.#variables) {
                color_scheme_element.style.setProperty(`${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${variable}`, `var(${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${color_scheme.name}-${variable})`);
            }
            color_scheme_element.title = color_scheme.name;
            color_scheme_element.type = "button";

            if (!this.#color_scheme.system_color_scheme && color_scheme.name === this.#color_scheme.name) {
                color_scheme_element.dataset.selected = true;
            }

            color_scheme_element.addEventListener("click", () => {
                if (color_scheme_element.dataset.selected) {
                    return;
                }

                this.#removeSelection();

                color_scheme_element.dataset.selected = true;

                this.#set(
                    color_scheme.name
                );
            });

            color_schemes_element.appendChild(color_scheme_element);
        }

        this.#shadow.appendChild(color_schemes_element);
    }
}

export const SELECT_COLOR_SCHEME_ELEMENT_TAG_NAME = "flux-select-color-scheme";

customElements.define(SELECT_COLOR_SCHEME_ELEMENT_TAG_NAME, SelectColorSchemeElement);
