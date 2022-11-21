import { COLOR_SCHEME_CSS_PROPERTY_PREFIX } from "../../../Adapter/ColorScheme/COLOR_SCHEME_CSS_PROPERTY_PREFIX.mjs";
import { COLOR_SCHEME_LIGHT } from "../../../Adapter/ColorScheme/COLOR_SCHEME.mjs";

/** @typedef {import("../Port/ColorSchemeService.mjs").ColorSchemeService} ColorSchemeService */

export class RenderColorSchemeCommand {
    /**
     * @type {ColorSchemeService}
     */
    #color_scheme_service;

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @returns {RenderColorSchemeCommand}
     */
    static new(color_scheme_service) {
        return new this(
            color_scheme_service
        );
    }

    /**
     * @param {ColorSchemeService} color_scheme_service
     * @private
     */
    constructor(color_scheme_service) {
        this.#color_scheme_service = color_scheme_service;
    }

    /**
     * @param {boolean} only_if_system_color_scheme
     * @returns {Promise<void>}
     */
    async renderColorScheme(only_if_system_color_scheme = false) {
        const color_scheme = await this.#color_scheme_service.getColorScheme();

        if (only_if_system_color_scheme && !color_scheme.system_color_scheme) {
            return;
        }

        for (const key of Array.from(document.documentElement.style).filter(_key => _key.startsWith(COLOR_SCHEME_CSS_PROPERTY_PREFIX))) {
            document.documentElement.style.removeProperty(key);
        }
        for (const variable of await this.#color_scheme_service.getVariables()) {
            document.documentElement.style.setProperty(`${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${variable}`, `var(${COLOR_SCHEME_CSS_PROPERTY_PREFIX}${color_scheme.name}-${variable})`);
        }

        const color_scheme_meta = document.head.querySelector("meta[name=color-scheme]") ?? document.createElement("meta");
        color_scheme_meta.content = color_scheme.color_scheme !== "" ? color_scheme.color_scheme : COLOR_SCHEME_LIGHT;
        color_scheme_meta.name = "color-scheme";
        if (!color_scheme_meta.isConnected) {
            document.head.appendChild(color_scheme_meta);
        }

        const theme_color_meta = document.head.querySelector("meta[name=theme-color]") ?? document.createElement("meta");
        theme_color_meta.content = await this.#color_scheme_service.getAccent();
        theme_color_meta.name = "theme-color";
        if (!theme_color_meta.isConnected) {
            document.head.appendChild(theme_color_meta);
        }
    }
}
